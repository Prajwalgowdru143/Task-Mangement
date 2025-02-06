const API_URL = 'http://localhost:5000/api';

export const api = {
  signup: async (userData) => {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  getTasks: async (token, filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/tasks?${queryString}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  createTask: async (token, taskData) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });
    return response.json();
  },

  updateTask: async (token, taskId, updates) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  deleteTask: async (token, taskId) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};