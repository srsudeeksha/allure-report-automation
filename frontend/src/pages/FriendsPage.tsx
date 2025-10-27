/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/FriendsPage.tsx
// Display all registered users from the backend

import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Users, Mail, Calendar } from 'lucide-react';
import { usersAPI } from '../services/api';
import type { User } from '../types';

/**
 * FriendsPage component
 * Displays all registered users from the MySQL database
 */
const FriendsPage: React.FC = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all users from the backend
   */
  const fetchFriends = async () => {
    setLoading(true);
    setError(null);

    try {
      const users = await usersAPI.getAllUsers();
      setFriends(users);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch friends list');
      console.error('Error fetching friends:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load friends on component mount
   */
  useEffect(() => {
    fetchFriends();
  }, []);

  /**
   * Get user initials for avatar
   */
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Users className="h-8 w-8" />
                  My Friends
                </h1>
                <p className="text-muted-foreground mt-1">
                  {loading ? 'Loading...' : `${friends.length} registered users`}
                </p>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Friends Grid */}
            {!loading && !error && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {friends.map((friend) => (
                  <Card
                    key={friend.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {getUserInitials(friend.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {friend.username}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          User ID: {friend.id}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">
                          {friend.email}
                        </span>
                      </div>
                      {friend.createdAt && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Joined {formatDate(friend.createdAt)}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && friends.length === 0 && (
              <Card className="p-12">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Friends Yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to register and invite your friends!
                  </p>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FriendsPage;