import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Camera, Heart, Users, Settings } from 'lucide-react';

export default function ProfileSettings() {
  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    age: 28,
    bio: 'Adventure seeker and coffee enthusiast',
    interests: ['Coffee', 'Hiking', 'Photography', 'Music'],
    modes: ['dating', 'friend']
  });

  const vibeQuestions = [
    { question: 'Pineapple on pizza?', answer: 'Absolutely yes!' },
    { question: 'Morning person or night owl?', answer: 'Night owl' },
    { question: 'Beach or mountains?', answer: 'Mountains' }
  ];

  const handleSave = () => {
    console.log('Saving profile...', profileData);
    // Here you would call the backend API to update the profile
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={profileData.age}
              onChange={(e) => setProfileData({ ...profileData, age: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Tell people about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photos & Videos
          </CardTitle>
          <CardDescription>
            Add photos and a 10-second video story
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            Add Photos
          </Button>
        </CardContent>
      </Card>

      {/* Mode Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Modes</CardTitle>
          <CardDescription>
            Choose which parts of HydraSpark you want to use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                <span>Dating Mode</span>
              </div>
              <Badge className={profileData.modes.includes('dating') ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-600'}>
                {profileData.modes.includes('dating') ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Friend Mode</span>
              </div>
              <Badge className={profileData.modes.includes('friend') ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}>
                {profileData.modes.includes('friend') ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vibe Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Vibe Questions</CardTitle>
          <CardDescription>
            Your answers help us calculate compatibility scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vibeQuestions.map((q, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <p className="font-medium mb-2">{q.question}</p>
                <p className="text-gray-600">{q.answer}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Update Vibe Answers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full">
        Save Changes
      </Button>
    </div>
  );
}