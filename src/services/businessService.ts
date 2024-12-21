import { apiClient } from '@/lib/axios';
import { CreateCustomerDto } from '@/types/business';

// Add this interface for payment data
interface RecordPaymentDto {
  amount: number;
  payment_date: string;
  notes?: string;
}

export const businessService = {
  checkProfile: async () => {
    const { data } = await apiClient.get('/business/profile/check');
    return data;
  },

  createProfile: async (formData: FormData) => {
    const { data } = await apiClient.post('/business/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  },

  getCustomers: async () => {
    const { data } = await apiClient.get('/business/customers');
    return data;
  },

  createCustomer: async (data: CreateCustomerDto) => {
    const { data: response } = await apiClient.post('/business/customers', data);
    return response.data;
  },

  getCustomer: async (id: string) => {
    const { data } = await apiClient.get(`/business/customers/${id}`);
    return data;
  },

  updateCustomer: async (id: string, data: CreateCustomerDto) => {
    const { data: response } = await apiClient.put(`/business/customers/${id}`, data);
    return response.data;
  },

  deleteCustomer: async (id: string) => {
    const { data } = await apiClient.delete(`/business/customers/${id}`);
    return data;
  },

  createInvoice: async (data: any) => {
    const { data: response } = await apiClient.post('/business/invoices', data);
    return response.data;
  },

  getCustomerInvoices: async (customerId: string) => {
    const { data } = await apiClient.get(`/business/customers/${customerId}/invoices`);
    return data;
  },

  getInvoice: async (id: string) => {
    const { data } = await apiClient.get(`/business/invoices/${id}`);
    return data;
  },

  downloadInvoice: async (id: string) => {
    const { data } = await apiClient.get(`/business/invoices/${id}/download`, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.pdf`);
    
    // Append to html link element page
    document.body.appendChild(link);
    
    // Start download
    link.click();
    
    // Clean up and remove the link
    link.parentNode?.removeChild(link);
  },

  sendInvoice: async (id: string) => {
    const { data } = await apiClient.post(`/business/invoices/${id}/send`);
    return data;
  },

  recordPayment: async (invoiceId: string, data: RecordPaymentDto) => {
    const response = await apiClient.post(`/business/invoices/${invoiceId}/payments`, {
      amount: data.amount,
      payment_date: data.payment_date,
      notes: data.notes
    });
    return response.data;
  },

  updateInvoiceStatus: async (id: string, status: string) => {
    const { data } = await apiClient.patch(`/business/invoices/${id}/status`, { status });
    return data;
  },

  getCustomerTransactions: async (customerId: string) => {
    const { data } = await apiClient.get(`/business/customers/${customerId}/transactions`);
    return data;
  },

  async getMetrics() {
    try {
      const response = await apiClient.get('/business/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching business metrics:', error);
      throw error;
    }
  },

  // Add other business-related API calls
}; 

// Add TypeScript interface for the metrics response
export interface BusinessMetrics {
  revenue: number;
  total_customers: number;
  customers_this_month: number;
  customer_growth: string;
  revenueData: {
    name: string;
    value: number;
  }[];
  recent_activities: Activity[];
} 