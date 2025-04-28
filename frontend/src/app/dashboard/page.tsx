'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { interviewApi } from '@/lib/api';
import { Interview, InterviewRequest, UserProfile } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiCalendar, FiClock, FiUser, FiVideo, FiFileText, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';

const DashboardPage = () => {
  const { user } = useAuth();
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [pastInterviews, setPastInterviews] = useState<Interview[]>([]);
  const [pendingRequests, setPendingRequests] = useState<InterviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user profile
        const profileResponse = await interviewApi.createProfile({
          userId: user?._id,
          role: 'candidate', // This should be dynamic based on user role
        });
        
        if (profileResponse.data.success) {
          setUserProfile(profileResponse.data.data);
        }
        
        // Fetch interviews
        const upcomingResponse = await interviewApi.getUpcomingInterviews();
        if (upcomingResponse.data.success) {
          setUpcomingInterviews(upcomingResponse.data.data);
        }
        
        const pastResponse = await interviewApi.getPastInterviews();
        if (pastResponse.data.success) {
          setPastInterviews(pastResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {user?.fullName}
        </p>
      </div>

      {/* Profile Summary */}
      <div className="mb-8">
        <Card
          title="Your Profile"
          subtitle="Manage your profile and preferences"
        >
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{user?.fullName}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-sm text-gray-500">
                Role: {userProfile?.role === 'candidate' ? 'Candidate' : 'Professional'}
              </p>
            </div>
            <div className="ml-auto">
              <Link href="/profile">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Interviews */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Interviews</h2>
          <Link href="/interviews/upcoming">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        {upcomingInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingInterviews.map((interview) => (
              <Card key={interview._id}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiVideo className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Interview with {interview.request.professional.fullName}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span>
                        {new Date(interview.scheduledAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span>
                        {new Date(interview.scheduledAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href={`/interviews/${interview._id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-6">
              <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming interviews</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any upcoming interviews scheduled.
              </p>
              <div className="mt-6">
                <Link href="/professionals">
                  <Button>Find a Professional</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Past Interviews */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Past Interviews</h2>
          <Link href="/interviews/past">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        {pastInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastInterviews.slice(0, 3).map((interview) => (
              <Card key={interview._id}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiFileText className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Interview with {interview.request.professional.fullName}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span>
                        {new Date(interview.completedAt || '').toLocaleDateString()}
                      </span>
                    </div>
                    {interview.aiFeedback && (
                      <div className="mt-1 text-sm text-gray-500">
                        Score: {interview.aiFeedback.overallScore}/10
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href={`/interviews/${interview._id}`}>
                    <Button size="sm">View Feedback</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-6">
              <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No past interviews</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't completed any interviews yet.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/professionals">
            <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Find a Professional</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Browse and connect with professional interviewers
                  </p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link href="/resume">
            <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FiFileText className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Upload Resume</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload your resume to get personalized interview questions
                  </p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link href="/messages">
            <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <FiMessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Messages</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    View and respond to messages from professionals
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 