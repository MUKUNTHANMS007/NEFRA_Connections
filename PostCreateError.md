## Post creation error: `description` is null

### Error observed

When creating a post from the frontend, the backend threw:

`org.hibernate.PropertyValueException: not-null property references a null or transient value : com.mukunthan.nefra_connections.entity.Post.description`

This indicates that Hibernate tried to persist a `Post` entity where the `description` field was `null`, even though the column is marked as `NOT NULL`.

### Relevant backend code

**DTO**

```java
public record PostCreateDTO(
        Long userId,
        String title,
        String description,
        String imageUrl
) {}
```

**Service**

```java
public PostResponseDTO createPost(PostCreateDTO request) {
    User user = userRepository.findById(request.userId())
            .orElseThrow(() -> new RuntimeException("User not found"));

    Post post = new Post();
    post.setUser(user);
    post.setTitle(request.title());
    post.setDescription(request.description()); // must NOT be null
    post.setImageUrl(request.imageUrl());

    Post savedPost = postRepository.save(post);
    return mapToDTO(savedPost);
}
```

**Entity**

```java
@Entity
@Table(name = "posts")
public class Post {
    ...

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    ...
}
```

Because `description` is `@Column(nullable = false)`, saving a `Post` with `description == null` causes the `PropertyValueException`.

### Root cause (frontend)

The frontend was sending a JSON payload with a `content` field instead of `description`, so Spring never populated `PostCreateDTO.description` and it remained `null`.

**Old code in `src/pages/Post.tsx`:**

```ts
await api.post('/posts', { userId: Number(userId), content });
```

Spring matches JSON keys to record fields by name (`userId`, `title`, `description`, `imageUrl`). Since the payload only contained `content`, the backend saw:

- `userId` → populated
- `title` → `null`
- `description` → `null`  ❌
- `imageUrl` → `null`

This led directly to the `description` not-null violation when persisting the `Post` entity.

### Fix applied (frontend)

Update the payload so that it uses the `description` field name expected by `PostCreateDTO`:

**Updated code in `src/pages/Post.tsx`:**

```ts
await api.post('/posts', { userId: Number(userId), description: content });
```

Now `PostCreateDTO.description` receives the value from the textarea, satisfying the not-null constraint on `Post.description`, and the post can be created successfully.

### Alternative backend-side option (not used)

If you preferred to keep the `content` field name in the frontend, you could instead adapt the DTO, for example:

```java
public record PostCreateDTO(
        Long userId,
        String title,
        @JsonProperty("content") String description,
        String imageUrl
) {}
```

This would allow the backend to accept a `content` key while still mapping it to the `description` field internally.

