import { apiClient } from '@/lib/axios';

export interface ProfessionalProfile {
  id: string;
  title: string;
  specialization: string;
  expertise_areas: string[];
  years_of_experience: number;
  hourly_rate: number;
  availability_status: 'available' | 'busy' | 'on_leave' | 'inactive';
  bio?: string;
  certifications?: string[];
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  preferred_contact_method: 'email' | 'phone' | 'whatsapp';
  timezone: string;
  languages: string[];
  rating?: number;
  total_sessions: number;
  status: 'active' | 'inactive' | 'suspended';
  verified_at?: string;
}

export interface DashboardData {
  currency: {
    code: string;
    symbol: string;
  };
  statistics: {
    monthly_revenue: number;
    total_revenue: number;
    completed_hustles: number;
    success_rate: number;
  };
  workstation: {
    has_active_subscription: boolean;
    subscription: {
      plan_name: string;
      end_date: string;
    } | null;
  };
  recent_activities: Array<{
    type: 'hustle' | 'payment' | 'workstation';
    title: string;
    category?: string;
    amount?: number;
    status: string;
    date: string;
  }>;
}

export const professionalService = {
  checkProfile: async () => {
    const response = await apiClient.get('/professional/profile/check');
    return response.data;
  },

  createProfile: async (data: Partial<ProfessionalProfile>) => {
    const response = await apiClient.post('/professional/profile', data);
    return response.data;
  },

  updateProfile: async (data: Partial<ProfessionalProfile>) => {
    const response = await apiClient.put('/professional/profile', data);
    return response.data;
  },

  getDashboardData: async (): Promise<DashboardData> => {
    const response = await apiClient.get('/professional/dashboard');
    return response.data;
  }
}; 