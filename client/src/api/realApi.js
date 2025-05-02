// Real API implementation to communicate with the serverless API connected to DynamoDB
import axios from 'axios';

// Base API URL - automatically detects environment
const API_BASE_URL = import.meta.env.PROD
  ? '/api/feedback' 
  : 'http://localhost:3000/api/feedback';

export const realApi = {
  // Get feedback with optional filters
  async getFeedback(filters = {}) {
    try {
      // Create query parameters from filters
      const params = new URLSearchParams();
      
      if (filters.projectName) {
        params.append('projectName', filters.projectName);
      }
      
      if (filters.sentiment) {
        params.append('sentiment', filters.sentiment);
      }
      
      if (filters.searchMethod) {
        params.append('searchMethod', filters.searchMethod);
      }
      
      if (filters.searchText) {
        params.append('searchText', filters.searchText);
      }
      
      // Make API call
      const queryString = params.toString();
      const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error('Failed to fetch feedback data');
    }
  },
  
  // Add new feedback
  async addFeedback(feedback) {
    try {
      // Validate required fields
      if (!feedback.id || !feedback.projectName || !feedback.sentiment) {
        throw new Error('Missing required fields: id, projectName, sentiment');
      }
      
      // Make API call
      const response = await axios.post(API_BASE_URL, feedback);
      return response.data;
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error.response?.data?.error || error.message || 'Failed to add feedback';
    }
  },
  
  // Delete feedback
  async deleteFeedback(id) {
    try {
      // Make API call
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error.response?.data?.error || error.message || 'Failed to delete feedback';
    }
  },
  
  // Update engineer feedback
  async updateEngineerFeedback(id, feedback) {
    try {
      // Make API call
      const response = await axios.patch(`${API_BASE_URL}/${id}`, { engineerFeedback: feedback });
      return response.data;
    } catch (error) {
      console.error('Error updating engineer feedback:', error);
      throw error.response?.data?.error || error.message || 'Failed to update engineer feedback';
    }
  }
}; 