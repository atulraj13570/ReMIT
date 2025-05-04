import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts';

// Get auth token from local storage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set auth token in headers
const setAuthHeader = () => {
  const token = getToken();
  if (token) {
    console.log('Setting auth token in headers');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }
  console.log('No auth token found in localStorage');
  return {
    headers: {
      'Content-Type': 'application/json'
    }
  };
};

// Get all posts
export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/`, setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error.response?.data?.msg || 'Error fetching posts';
  }
};

// Create a new post
export const createPost = async (content) => {
  try {
    const response = await axios.post(`${API_URL}/`, { content }, setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error.response?.data?.msg || 'Error creating post';
  }
};

// Like a post
export const likePost = async (postId) => {
  try {
    const response = await axios.put(`${API_URL}/like/${postId}`, {}, setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error.response?.data?.msg || 'Error liking post';
  }
};

// Unlike a post
export const unlikePost = async (postId) => {
  try {
    const response = await axios.put(`${API_URL}/unlike/${postId}`, {}, setAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Error unliking post';
  }
};

// Add a comment to a post
export const addComment = async (postId, text) => {
  try {
    const response = await axios.post(`${API_URL}/comment/${postId}`, { text }, setAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Error adding comment';
  }
};

// Delete a comment
export const deleteComment = async (postId, commentId) => {
  try {
    const response = await axios.delete(`${API_URL}/comment/${postId}/${commentId}`, setAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Error deleting comment';
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_URL}/${postId}`, setAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Error deleting post';
  }
};
