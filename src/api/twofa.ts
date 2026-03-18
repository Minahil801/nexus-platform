import api from './config';

export const twofaAPI = {
  // Send OTP
  sendOTP: async (email: string) => {
    const response = await api.post('/2fa/send-otp', { email });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string) => {
    const response = await api.post('/2fa/verify-otp', { email, otp });
    return response.data;
  }
};

export default twofaAPI;