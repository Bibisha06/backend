export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  role: 'candidate' | 'professional';
  bio?: string;
  skills?: string[];
  experience?: string;
  availability?: {
    days: string[];
    timeSlots: string[];
  };
  resume?: string;
}

export interface InterviewRequest {
  _id: string;
  candidate: UserProfile;
  professional: UserProfile;
  requestedDate: string;
  requestedTimeSlot: string;
  status: 'pending' | 'accepted' | 'rejected' | 'rescheduled';
  rescheduledDate?: string;
  rescheduledTimeSlot?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  _id: string;
  request: InterviewRequest;
  meetingLink?: string;
  aiGeneratedQuestions?: string[];
  aiFeedback?: {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    facialExpressions: {
      happy: number;
      nervous: number;
      confident: number;
      [key: string]: number;
    };
  };
  professionalFeedback?: {
    rating: number;
    comments: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
} 