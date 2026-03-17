import api from './config';

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    role: 'entrepreneur' | 'investor';
  };
}

interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    role: 'entrepreneur' | 'investor';
  };
}

interface ProfileData {
  bio?: string;
  company?: string;
  industry?: string;
  investmentHistory?: string[];
  startupHistory?: string[];
  preferences?: any;
}

export const authAPI = {
  // Register
  register: async (email: string, password: string, role: 'entrepreneur' | 'investor'): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', { email, password, role });
    return response.data;
  },

  // Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  // Get Profile
  getProfile: async (): Promise<any> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update Profile
  updateProfile: async (profileData: ProfileData): Promise<any> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  }
};

export default authAPI;