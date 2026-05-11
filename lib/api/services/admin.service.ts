import api from '../axios-instance';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface UsersResponse {
  total_user: number;
  active_user: number;
  inactive_user: number;
  users: User[];
}

export interface Activity {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export const adminService = {
  getUsers: async (): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>('auth/admin/users/');
    return response.data;
  },

  getRecentActivity: async (): Promise<Activity[]> => {
    const response = await api.get<Activity[]>('core/admin/recent-activity/');
    return response.data;
  },

  // Example of other potential methods
  getUserDetails: async (id: string | number): Promise<User> => {
    const response = await api.get<User>(`auth/admin/users/${id}/`);
    return response.data;
  }
};
