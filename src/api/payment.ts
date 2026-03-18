import api from './config';


export const paymentAPI = {
  // Deposit money
  deposit: async (amount: number, paymentMethod?: string) => {
    const response = await api.post('/payment/deposit', { 
      amount, 
      paymentMethod: paymentMethod || 'stripe' 
    });
    return response.data;
  },

  // Withdraw money
  withdraw: async (amount: number, paymentMethod?: string) => {
    const response = await api.post('/payment/withdraw', { 
      amount, 
      paymentMethod: paymentMethod || 'bank_transfer' 
    });
    return response.data;
  },

  // Transfer money
  transfer: async (recipientId: string, amount: number) => {
    const response = await api.post('/payment/transfer', { 
      recipientId, 
      amount 
    });
    return response.data;
  },

  // Get transaction history
  getTransactionHistory: async () => {
    const response = await api.get('/payment/history');
    return response.data;
  },

  // Get transaction by ID
  getTransactionById: async (id: string) => {
    const response = await api.get(`/payment/${id}`);
    return response.data;
  }
};

export default paymentAPI;