import api from '../axios-instance';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  gender?: string;
  phone_number?: string | null;
  avatar?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface Child {
  id: number;
  full_name: string;
  photo: string;
}

export interface UserDetail {
  user: User;
  co_parents: User[];
  children: Child[];
  stats?: any;
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

export interface DashboardStats {
  total_parents: number;
  total_children: number;
  today_total_messages: number;
  active_users: number;
  current_month_expenses: number;
  upcoming_schedules_7days: number;
  user_activity?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
  expense_overview?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
  recent_activity?: Activity[];
}



export interface ContentInfo {
  id: number;
  title?: string;
  name?: string;
  content?: string;
  description?: string;
  logo?: string;
  image?: string;
}

export interface AIPrompt {
  id: number;
  name: string;
  prompt_text: string;
  created_at?: string;
  updated_at?: string;
}

export const adminService = {
  // Dashboard & Stats
  getUsers: async (): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>('auth/admin/users/');
    return response.data;
  },

  getRecentActivity: async (): Promise<Activity[]> => {
    const response = await api.get<Activity[]>('core/admin/recent-activity/');
    return response.data;
  },

  getDashboardData: async (period: string = '1 month'): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>(`core/dashboard/?period=${period}`);
    return response.data;
  },

  // User Management
  getUserDetails: async (id: string | number): Promise<UserDetail> => {
    const response = await api.get<UserDetail>(`core/admin/user-detail/?user_id=${id}`);
    return response.data;
  },

  getUserById: async (id: string | number): Promise<User> => {
    const response = await api.get<User>(`auth/admin/users/${id}/`);
    return response.data;
  },

  updateUser: async (id: string | number, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`auth/admin/users/${id}/`, data);
    return response.data;
  },

  deleteUser: async (id: string | number): Promise<void> => {
    await api.delete(`auth/admin/users/${id}/`);
  },

  // Child Data
  getChildrenByCoparent: async (userId: string | number): Promise<any[]> => {
    const response = await api.get<any[]>(`core/admin/children-by-coparent/?user_id=${userId}`);
    return response.data;
  },

  getChildData: async (childId: string | number): Promise<any> => {
    const response = await api.get<any>(`core/admin/child-data/?child_id=${childId}`);
    return response.data;
  },

  // Content Management
  getPrivacyInfo: async (): Promise<ContentInfo[]> => {
    const response = await api.get<ContentInfo[]>('about/admin/legal-privacy-info/');
    return response.data;
  },

  updatePrivacyInfo: async (id: number, data: FormData | any): Promise<ContentInfo> => {
    const response = await api.put<ContentInfo>(`about/admin/legal-privacy-info/${id}/`, data);
    return response.data;
  },

  getAboutInfo: async (): Promise<ContentInfo[]> => {
    const response = await api.get<ContentInfo[]>('about/admin/about-info/');
    return response.data;
  },

  updateAboutInfo: async (id: number, data: FormData | any): Promise<ContentInfo> => {
    const response = await api.put<ContentInfo>(`about/admin/about-info/${id}/`, data, {
      headers: data instanceof FormData ? { 'Content-Type': undefined } : {}
    });
    return response.data;
  },

  getOnboardingInfo: async (): Promise<ContentInfo[]> => {
    const response = await api.get<ContentInfo[]>('about/admin/onboarding-info/');
    return response.data;
  },

  updateOnboardingInfo: async (id: number, data: FormData | any): Promise<ContentInfo> => {
    const response = await api.put<ContentInfo>(`about/admin/onboarding-info/${id}/`, data, {
      headers: data instanceof FormData ? { 'Content-Type': undefined } : {}
    });
    return response.data;
  },

  // AI Prompts
  getAIPrompts: async (): Promise<AIPrompt[]> => {
    const response = await api.get<AIPrompt[]>('chat/prompts/');
    return response.data;
  },

  getAIPromptByName: async (name: string): Promise<AIPrompt> => {
    const response = await api.get<AIPrompt>(`chat/prompts/${name}/`);
    return response.data;
  },

  deleteAIPrompt: async (name: string): Promise<void> => {
    await api.delete(`chat/prompts/${name}/`);
  },

  updateAIPrompt: async (name: string, data: { name: string, prompt_text: string }): Promise<AIPrompt> => {
    const response = await api.put<AIPrompt>(`chat/prompts/${name}/`, data);
    return response.data;
  },

  exportAIChat: async (userId: string | number): Promise<void> => {
    const response = await api.get(`core/export/ai-chat/?user_id=${userId}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ai-chat-${userId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportCoparentChat: async (userId: string | number, coParentId: string | number): Promise<void> => {
    const response = await api.get(`core/export/coparent-chat/?user_id=${userId}&co_parent_id=${coParentId}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `coparent-chat-${userId}-${coParentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

