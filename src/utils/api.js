const API_URL = (
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  import.meta.env?.VITE_API_URL ||
  'http://localhost:5000'
);

const API_BASE_URL = `${API_URL.replace(/\/$/, '')}/api`;

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data;
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  
  if (!response.ok) {
    console.error('API Error:', { status: response.status, data });
    throw new Error(data.error || data.message || 'Something went wrong');
  }
  
  return data;
};

// Get auth token from localStorage
const TOKEN_KEY = 'authToken';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await handleResponse(response);
    
    // Store token and user data
    if (data.success && data.data.token) {
      setAuthToken(data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  },

  // Login user
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await handleResponse(response);
    
    // Store token and user data
    if (data.success && data.data.token) {
      setAuthToken(data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  },

  // Get user profile
  getProfile: async () => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  },

  // Logout user
  logout: async () => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    removeAuthToken();
    localStorage.removeItem('user');
    
    return await handleResponse(response);
  },
};

// Notes API calls
export const notesAPI = {
  // Get all active notes
  getAll: async () => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  },

  // Get single note
  getById: async (id) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  },

  // Create new note
  create: async (title, content, color = '#ffffff') => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, color }),
    });
    
    return await handleResponse(response);
  },

  // Update note
  update: async (id, title, content, color) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, color }),
    });
    
    return await handleResponse(response);
  },

  // Archive note
  archive: async (id) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes/${id}/archive`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  },

  // Unarchive note
  unarchive: async (id) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes/${id}/unarchive`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  },

  // Move to trash
  trash: async (id) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes/${id}/trash`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  },

  // Restore from trash
  restore: async (id) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes/${id}/restore`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  },

  // Delete permanently
  delete: async (id) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  },

  // Get archived notes
  getArchived: async () => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes/archived`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  },

  // Get trashed notes
  getTrashed: async () => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes/trash`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  },

  // Get notes stats
  getStats: async () => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notes/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return await handleResponse(response);
  },
};

export { getAuthToken, setAuthToken, removeAuthToken };
