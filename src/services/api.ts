const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: getAuthHeaders(),
    ...options
  };

  const response = await fetch(url, config);
  return handleResponse(response);
};

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  register: async (userData: { name: string; email: string; password: string; role: string }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  updateProfile: async (profileData: any) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }
};

// Tables API
export const tablesAPI = {
  getAll: async (params?: { zoneId?: string; status?: string; isActive?: boolean }) => {
    const queryParams = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest(`/tables${queryParams}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/tables/${id}`);
  },

  create: async (tableData: any) => {
    return apiRequest('/tables', {
      method: 'POST',
      body: JSON.stringify(tableData)
    });
  },

  update: async (id: string, tableData: any) => {
    return apiRequest(`/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tableData)
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/tables/${id}`, {
      method: 'DELETE'
    });
  },

  getByZone: async (zoneId: string) => {
    return apiRequest(`/tables/zone/${zoneId}`);
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/tables/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};

// Zones API
export const zonesAPI = {
  getAll: async (params?: { isActive?: boolean }) => {
    const queryParams = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest(`/zones${queryParams}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/zones/${id}`);
  },

  create: async (zoneData: any) => {
    return apiRequest('/zones', {
      method: 'POST',
      body: JSON.stringify(zoneData)
    });
  },

  update: async (id: string, zoneData: any) => {
    return apiRequest(`/zones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(zoneData)
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/zones/${id}`, {
      method: 'DELETE'
    });
  },

  getStatistics: async (id: string) => {
    return apiRequest(`/zones/${id}/statistics`);
  },

  getWithTables: async () => {
    return apiRequest('/zones/with-tables/all');
  }
};

// Bookings API
export const bookingsAPI = {
  getAll: async (params?: any) => {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/bookings${queryParams}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/bookings/${id}`);
  },

  create: async (bookingData: any) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  update: async (id: string, bookingData: any) => {
    return apiRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData)
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/bookings/${id}`, {
      method: 'DELETE'
    });
  },

  getByDate: async (date: string) => {
    return apiRequest(`/bookings/date/${date}`);
  }
};

// Statistics API
export const statisticsAPI = {
  getDashboard: async () => {
    return apiRequest('/statistics/dashboard');
  },

  getBookingStats: async (params?: any) => {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/statistics/bookings${queryParams}`);
  },

  getTableStats: async () => {
    return apiRequest('/statistics/tables');
  },

  getRevenueStats: async (params?: any) => {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/statistics/revenue${queryParams}`);
  }
};

// Restaurant API
export const restaurantAPI = {
  getInfo: async () => {
    return apiRequest('/restaurant/info');
  },

  updateInfo: async (restaurantData: any) => {
    return apiRequest('/restaurant/info', {
      method: 'PUT',
      body: JSON.stringify(restaurantData)
    });
  },

  getSettings: async () => {
    return apiRequest('/restaurant/settings');
  },

  updateSettings: async (settingsData: any) => {
    return apiRequest('/restaurant/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    });
  }
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => {
    return apiRequest('/notifications');
  },

  markAsRead: async (id: string) => {
    return apiRequest(`/notifications/${id}/read`, {
      method: 'PATCH'
    });
  },

  markAllAsRead: async () => {
    return apiRequest('/notifications/read-all', {
      method: 'PATCH'
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/notifications/${id}`, {
      method: 'DELETE'
    });
  }
};

export default {
  auth: authAPI,
  tables: tablesAPI,
  zones: zonesAPI,
  bookings: bookingsAPI,
  statistics: statisticsAPI,
  restaurant: restaurantAPI,
  notifications: notificationsAPI
};
