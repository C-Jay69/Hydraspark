import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin, Camera, Plus, X } from 'lucide-react';

interface ProfileData {
  bio: string;
  city: string;
  interests: string[];
  [key: string]: any;
}

interface ProfileSetupProps {
  onNext: () => void;
  onDataChange: (data: ProfileData) => void;
  initialData?: ProfileData;
}

function ProfileSetup({ onNext, onDataChange, initialData }: ProfileSetupProps) {
  const [profile, setProfile] = useState({
    bio: initialData?.bio || '',
    city: initialData?.city || '',
    interests: initialData?.interests || [],
    ...initialData,
  });

  const [currentInterest, setCurrentInterest] = useState('');

  const suggestedInterests = [
    'Travel', 'Photography', 'Cooking', 'Fitness', 'Music', 'Movies',
    'Reading', 'Dancing', 'Hiking', 'Art', 'Gaming', 'Yoga',
    'Coffee', 'Wine', 'Concerts', 'Theatre', 'Sports', 'Tech'
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev: ProfileData) => ({ ...prev, [field]: value }));
  };

  const addInterest = (interest: string) => {
    if (interest && !profile.interests.includes(interest) && profile.interests.length < 10) {
      setProfile((prev: ProfileData) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
      setCurrentInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setProfile((prev: ProfileData) => ({
      ...prev,
      interests: prev.interests.filter((i: string) => i !== interest),
    }));
  };

  const handleNext = () => {
    onDataChange(profile);
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Set Up Your Profile</CardTitle>
        <CardDescription>
          Tell others about yourself and what you're passionate about
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photo Upload Placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Photos</label>
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
              <div className="text-center">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Add Photo</p>
              </div>
            </div>
            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Add 2-6 photos that show your personality</p>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-sm font-medium">About You</label>
          <Textarea
            placeholder="Tell people a bit about yourself, your interests, and what you're looking for..."
            value={profile.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {profile.bio.length}/500 characters
          </p>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Enter your city"
              value={profile.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Interests ({profile.interests.length}/10)</label>
          
          {/* Selected Interests */}
          {profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.interests.map((interest: string) => (
                <Badge key={interest} variant="secondary" className="text-sm">
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add Interest */}
          <div className="flex gap-2">
            <Input
              placeholder="Add an interest"
              value={currentInterest}
              onChange={(e) => setCurrentInterest(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addInterest(currentInterest);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addInterest(currentInterest)}
              disabled={!currentInterest || profile.interests.length >= 10}
            >
              Add
            </Button>
          </div>

          {/* Suggested Interests */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedInterests
                .filter(interest => !profile.interests.includes(interest))
                .slice(0, 12)
                .map((interest) => (
                  <Button
                    key={interest}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addInterest(interest)}
                    disabled={profile.interests.length >= 10}
                    className="text-xs"
                  >
                    + {interest}
                  </Button>
                ))}
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            size="lg"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileSetup;
