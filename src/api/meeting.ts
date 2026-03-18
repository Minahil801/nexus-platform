import api from './config';

interface Meeting {
  title: string;
  description?: string;
  participants: string[];
  startTime: string;
  endTime: string;
  meetingLink?: string;
}

export const meetingAPI = {
  // Create meeting
  createMeeting: async (meetingData: Meeting) => {
    const response = await api.post('/meetings/create', meetingData);
    return response.data;
  },

  // Get user meetings
  getMyMeetings: async () => {
    const response = await api.get('/meetings/my-meetings');
    return response.data;
  },

  // Get meeting by ID
  getMeetingById: async (id: string) => {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  },

  // Respond to meeting (accept/reject)
  respondToMeeting: async (id: string, status: 'accepted' | 'rejected') => {
    const response = await api.put(`/meetings/${id}/respond`, { status });
    return response.data;
  },

  // Update meeting
  updateMeeting: async (id: string, meetingData: Partial<Meeting>) => {
    const response = await api.put(`/meetings/${id}`, meetingData);
    return response.data;
  },

  // Delete meeting
  deleteMeeting: async (id: string) => {
    const response = await api.delete(`/meetings/${id}`);
    return response.data;
  }
};

export default meetingAPI;