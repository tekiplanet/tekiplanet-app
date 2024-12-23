import axios from 'axios';

// Export the apiClient instance
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// We should use the same instance for all requests
export const axiosInstance = apiClient;

// Add request interceptor to add token
apiClient.interceptors.request.use((config) => {
  console.log('Request Config:', {
    url: config.url,
    baseURL: config.baseURL,
    fullPath: config.baseURL + config.url,
    method: config.method,
    headers: config.headers
  });
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
