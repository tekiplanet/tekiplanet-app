import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.43.190:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

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

// Export both named and default exports
export { apiClient };
export default apiClient;
