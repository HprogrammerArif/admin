import api from '../axios-instance';

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Matching Postman request exactly: only email and password
    const response = await api.post<LoginResponse>('auth/login/', { 
      email, 
      password 
    });
    return response.data;
  },



  logout: async (): Promise<void> => {
    // Optional: Call backend logout if implemented
    // await api.post('auth/logout/');
  }
};
