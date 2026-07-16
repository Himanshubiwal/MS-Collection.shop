import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const cleanBaseUrl = rawApiUrl.replace(/\/+$/, '');

if (typeof window !== 'undefined' && window.location.protocol === 'https:' && cleanBaseUrl.includes('localhost')) {
  console.warn(
    '⚠️ [MS Collection API Warning]: The frontend is deployed over HTTPS but is attempting to connect to localhost (' +
      cleanBaseUrl +
      '). Please ensure VITE_API_URL is configured under Project Settings > Environment Variables in Vercel and trigger a new deployment.'
  );
}

const api = axios.create({
  baseURL: cleanBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper utility to safely resolve image paths regardless of whether they are local (/uploads/...), localhost, or absolute
export const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600';

  const backendHost = cleanBaseUrl.replace(/\/api\/?$/, '');

  // If the URL contains localhost or 127.0.0.1 (e.g. from local seeder run), redirect it to our cloud backend host
  if (url.includes('localhost:') || url.includes('127.0.0.1:')) {
    const pathPart = url.replace(/^http:\/\/(localhost|127\.0\.0\.1):[0-9]+/, '');
    return `${backendHost}${pathPart.startsWith('/') ? '' : '/'}${pathPart}`;
  }

  // If already absolute secure or data URI
  if (url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  // Upgrade insecure HTTP to HTTPS on secure origins to prevent browser Mixed Content blocking
  if (url.startsWith('http://')) {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      return url.replace('http://', 'https://');
    }
    return url;
  }

  // Handle relative or /uploads/ paths
  return `${backendHost}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Request interceptor to attach JWT token if available in localStorage
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('mscollection_user');
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        if (parsedUser && parsedUser.token) {
          config.headers.Authorization = `Bearer ${parsedUser.token}`;
        }
      } catch (err) {
        console.error('Error parsing token from localStorage', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
