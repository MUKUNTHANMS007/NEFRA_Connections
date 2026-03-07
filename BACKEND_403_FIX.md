# Fix 403 Forbidden on POST /api/v1/auth/login (Spring Boot Backend)

Your request **does** reach the app (Hibernate runs the user lookup), but Spring Security still returns **403**. Common causes with your setup:

1. **Path matching** – JWT filter or authorization might not match `/api/v1/auth` correctly (e.g. context path or `getServletPath()`).
2. **CORS** – With `allowCredentials(true)`, a missing or wrong `Origin` (e.g. from Postman) can lead to a 403 in some setups.
3. **AuthService** – Throwing `AccessDeniedException` (or an exception that maps to 403) during login/register.

Apply the changes below in your **NEFRA_backend** project.

---

## 1. SecurityConfig – Explicit auth paths and CORS

Use this **exact** `SecurityConfig` so `/api/v1/auth/**` is clearly public and CORS works from browser and Postman.

```java
package com.mukunthan.nefra_connections.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

- `/api/v1/auth/**` is **permitAll()** (login/register without token).
- All other requests require authentication (e.g. JWT).
- CORS unchanged; for Postman, see section 3.

---

## 2. JwtAuthenticationFilter – Reliable path bypass

Use the **request URI** so the bypass works regardless of context path or servlet mapping:

```java
@Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    return path != null && path.startsWith("/api/v1/auth");
}
```

Then in `doFilterInternal`, **remove** the bypass block at the top (the `if (request.getServletPath().contains("/api/v1/auth")) { ... return; }`).  
`shouldNotFilter` ensures this filter is **never** run for `/api/v1/auth/**`, so those requests skip JWT logic entirely and cannot get a 403 from this filter.

Full filter example:

```java
@Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    return path != null && path.startsWith("/api/v1/auth");
}

@Override
protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
) throws ServletException, IOException {
    final String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }
    final String jwt = authHeader.substring(7);
    final String username = jwtService.extractUsername(jwt);
    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
        if (jwtService.isTokenValid(jwt, userDetails)) {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }
    filterChain.doFilter(request, response);
}
```

---

## 3. Postman – Avoid 403 from CORS/Origin

Your backend allows only `http://localhost:5173`. Postman often sends no `Origin` or a different one, which can lead to 403 in some configurations.

**In Postman for the login request:**

1. Open the request **Headers** tab.
2. Add:  
   **Key:** `Origin`  
   **Value:** `http://localhost:5173`
3. Send the POST again.

If 403 disappears, the issue was CORS/Origin; the backend code above is still recommended so the browser (which always sends Origin) keeps working.

---

## 4. AuthService – Do not trigger 403 on login/register

403 is returned when Spring Security sees `AccessDeniedException`. Your login/register flow must **not** throw it.

- For **wrong password** or **user not found**: throw or map to **401** (e.g. `BadCredentialsException` or `ResponseEntity.status(401)`), not `AccessDeniedException`.
- Do not throw `AccessDeniedException` (or any exception that translates to 403) inside `AuthService.authenticate()` or `AuthService.register()`.

Example for invalid credentials (pseudo-code):

```java
// In AuthService.authenticate() – use 401, not 403
if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
    throw new BadCredentialsException("Invalid credentials");
}
```

---

## 5. Duplicate username on register (from your logs)

Your stack trace shows:

`Duplicate entry 'angel_capital' for key 'users.username'`

So register is reached; the 403 you see in Postman is for **login**, not register. For **register**, return a **409 Conflict** (or 400) with a clear message when the username already exists, and handle it in the frontend (e.g. “Username already taken”). Do not throw `AccessDeniedException` for duplicate username.

---

## Checklist

1. Replace `SecurityConfig` with the version above (explicit `permitAll()` for `/api/v1/auth/**`).
2. In `JwtAuthenticationFilter`, add `shouldNotFilter` and remove the in-filter path bypass; keep the rest of the JWT logic.
3. In Postman, add header `Origin: http://localhost:5173` for the login request.
4. In `AuthService`, ensure login/register never throw `AccessDeniedException`; use 401 for bad credentials and 409/400 for duplicate username.

After that, POST `/api/v1/auth/login` from Postman (and from your frontend) should return **200** with the token instead of **403**.
