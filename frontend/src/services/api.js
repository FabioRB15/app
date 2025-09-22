import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Game Servers
  async getServers() {
    try {
      const response = await api.get('/servers');
      return response.data.servers;
    } catch (error) {
      console.error('Error fetching servers:', error);
      throw error;
    }
  },

  async createServer(serverData) {
    try {
      const response = await api.post('/servers', serverData);
      return response.data;
    } catch (error) {
      console.error('Error creating server:', error);
      throw error;
    }
  },

  async updateServerStatus(serverId, status) {
    try {
      const response = await api.put(`/servers/${serverId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating server status:', error);
      throw error;
    }
  },

  // Pricing Plans
  async getPricingPlans() {
    try {
      const response = await api.get('/pricing-plans');
      return response.data.plans;
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      throw error;
    }
  },

  // Dashboard Statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data.stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Testimonials
  async getTestimonials() {
    try {
      const response = await api.get('/testimonials');
      return response.data.testimonials;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },

  async createTestimonial(testimonialData) {
    try {
      const response = await api.post('/testimonials', testimonialData);
      return response.data;
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
  },

  // Support
  async submitSupportRequest(requestData) {
    try {
      const response = await api.post('/support/contact', requestData);
      return response.data;
    } catch (error) {
      console.error('Error submitting support request:', error);
      throw error;
    }
  },

  // Authentication
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  async socialLogin(provider, socialData) {
    try {
      const response = await api.post('/auth/social', { provider, ...socialData });
      return response.data;
    } catch (error) {
      console.error('Social login failed:', error);
      throw error;
    }
  },

  async verifyToken(token) {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Password Reset
  async forgotPassword(data) {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  },

  async resetPassword(data) {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  },

  // Email Verification
  async resendVerificationEmail(data) {
    try {
      const response = await api.post('/auth/resend-verification', data);
      return response.data;
    } catch (error) {
      console.error('Resend verification failed:', error);
      throw error;
    }
  },

  async verifyEmail(token) {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  }
};

export default apiService;