import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userApi = {
  register: async (userData: any) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (key === 'avatar' || key === 'coverImage') {
        if (userData[key]) {
          formData.append(key, userData[key]);
        }
      } else {
        formData.append(key, userData[key]);
      }
    });
    
    return api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  login: async (credentials: { email?: string; username?: string; password: string }) => {
    return api.post('/users/login', credentials);
  },
  
  logout: async () => {
    return api.post('/users/logout');
  },
  
  getCurrentUser: async () => {
    return api.post('/users/current-user');
  },
  
  updateProfile: async (userData: any) => {
    return api.patch('/users/update-account', userData);
  },
  
  updateAvatar: async (avatar: File) => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    
    return api.patch('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateCoverImage: async (coverImage: File) => {
    const formData = new FormData();
    formData.append('coverImage', coverImage);
    
    return api.patch('/users/cover-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  changePassword: async (passwords: { oldPassword: string; newPassword: string }) => {
    return api.post('/users/change-password', passwords);
  },
};

// Interview API (to be implemented in the backend)
export const interviewApi = {
  createProfile: async (profileData: any) => {
    return api.post('/interviews/profile', profileData);
  },
  
  getProfessionals: async () => {
    return api.get('/interviews/professionals');
  },
  
  getCandidates: async () => {
    return api.get('/interviews/candidates');
  },
  
  requestInterview: async (requestData: any) => {
    return api.post('/interviews/request', requestData);
  },
  
  respondToRequest: async (requestId: string, response: { status: 'accepted' | 'rejected' | 'rescheduled', newTime?: string }) => {
    return api.post(`/interviews/respond/${requestId}`, response);
  },
  
  getUpcomingInterviews: async () => {
    return api.get('/interviews/upcoming');
  },
  
  getPastInterviews: async () => {
    return api.get('/interviews/past');
  },
  
  submitFeedback: async (interviewId: string, feedback: any) => {
    return api.post(`/interviews/feedback/${interviewId}`, feedback);
  },
  
  getInterviewDetails: async (interviewId: string) => {
    return api.get(`/interviews/${interviewId}`);
  },
};

export default api; 