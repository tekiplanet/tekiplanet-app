import { apiClient } from '@/lib/axios';

export interface StudentDashboardData {
  user: {
    first_name: string;
    wallet_balance: number;
  };
  currency: {
    code: string;
    symbol: string;
  };
  statistics: {
    achievements: number;
    enrolled_courses: number;
    overall_progress: number;
  };
  courses: Array<{
    id: string;
    title: string;
    progress: number;
    nextClass: string | null;
    image: string;
    instructor: string;
    totalLessons: number;
    completedLessons: number;
  }>;
  has_enrollments: boolean;
}

export const studentService = {
  getDashboardData: async (): Promise<StudentDashboardData> => {
    const response = await apiClient.get('/student/dashboard');
    return response.data;
  }
}; 