import axios from 'axios';

const api = axios.create({
  // Ensure this matches your actual Spring Boot context path and versioning
  baseURL: 'http://localhost:8081/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * THE FIX: Request Interceptor
 * This automatically injects the User ID into every request header.
 * This allows the backend to handle the Chat history without complex security filters.
 */
api.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Injects the header we defined in the ChatController
      config.headers['X-User-Id'] = userId;
      
      // If you decide to add JWT later, you'd add it here too:
      // const token = localStorage.getItem('token');
      // if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;