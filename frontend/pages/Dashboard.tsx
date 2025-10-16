
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Users, Shield, Settings, Zap, MessageCircle, Calendar, TrendingUp } from 'lucide-react';
import DatingMode from '../components/dashboard/DatingMode';
import FriendMode from '../components/dashboard/FriendMode';
import SafetyMode from '../components/dashboard/SafetyMode';
import ProfileSettings from '../components/dashboard/ProfileSettings';
import GroupList from '../components/community/GroupList';
import EventManagement from '../components/events/EventManagement';

function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dating');

  const userModes = ['dating', 'friend']; // This would come from user profile
  const safetyScore = 25; // This would come from backend

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-magenta-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-magenta-600 to-cyan-600 bg-clip-text text-transparent">
                HydraSpark
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{safetyScore} Safety Points</span>
              </div>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600">Ready to ignite some connections?</p>
            </div>
            <div className="flex items-center gap-2">
              {userModes.includes('dating') && (
                <Badge className="bg-pink-100 text-pink-800 border-pink-200">
                  <Heart className="h-3 w-3 mr-1" />
                  Dating
                </Badge>
              )}
              {userModes.includes('friend') && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Users className="h-3 w-3 mr-1" />
                  Friend
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">New Matches</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Conversations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Avg Vibe Score</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dating" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Dating
            </TabsTrigger>
            <TabsTrigger value="friend" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Events
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dating" className="space-y-6">
            <DatingMode />
          </TabsContent>

          <TabsContent value="friend" className="space-y-6">
            <FriendMode />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <GroupList />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <EventManagement />
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <SafetyMode />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Dashboard;
