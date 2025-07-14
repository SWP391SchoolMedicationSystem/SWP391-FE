import axios from 'axios';

const API_BASE_URL = 'https://api-schoolhealth.purintech.id.vn/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  },
  withCredentials: false // Prevent CORS issues
});

// Blog service functions
export const blogService = {
  // Get all blogs
  getAllBlogs: async () => {
    try {
      const response = await api.get('/Blog/getAll');
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  // Get blog by ID (if needed later)
  getBlogById: async (blogId) => {
    try {
      const response = await api.get(`/Blog/${blogId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }
};

export default blogService; 