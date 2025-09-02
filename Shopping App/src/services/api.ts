const API_BASE_URL = 'http://localhost:3001/api';

// API response types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  avatar?: string;
  isVerified: boolean;
}

export interface Product {
  id: number;
  name: string;
  price?: string;
  priceValue: number;
  category: 'electronics' | 'precious_metals' | 'collectibles';
  condition?: string;
  seller: string;
  images: string[];
  video?: string;
  isFavorite?: boolean;
  description: string;
  location: string;
  specifications?: string[];
  warranty?: string;
  
  // Precious metals specific
  purity?: string;
  certification?: string;
  emergencyFund?: boolean;
  processingTime?: string;
  
  // Collectibles specific (auction items)
  currentBid?: string;
  startingBid?: string;
  auctionEnd?: string;
  bidCount?: number;
  rarity?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Auth API calls
export const authAPI = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    location?: {
      city: string;
      state: string;
      country: string;
    };
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },
};

// Products API calls
export const productsAPI = {
  getAll: async (filters?: {
    category?: string;
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/products?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products || [];
  },

  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    return data.product;
  },

  create: async (productData: FormData, token: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: productData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create product');
    }

    const data = await response.json();
    return data.product;
  },
};

// Utility functions
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
