
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, X, Star, Zap } from 'lucide-react';
import { useBackend } from '../../hooks/useBackend';

export default function DatingMode() {
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const { call } = useBackend();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const { recommendations } = await call('matching.recommendations');
      setCurrentProfile(recommendations[0]);
    };
    fetchRecommendations();
  }, [call]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    await call('matching.swipe', { direction, profileId: currentProfile.id });
    const { recommendations } = await call('matching.recommendations');
    setCurrentProfile(recommendations[0]);
  };

  if (!currentProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="relative overflow-hidden">
        <div className="aspect-[3/4] bg-gradient-to-b from-gray-300 to-gray-500 relative">
          <img
            src={currentProfile.profilePicture}
            alt={currentProfile.firstName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE4MCIgcj0iNjAiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTEwMCAzNTBDMTAwIDMwMC4yOTQgMTM5Ljc5NiAyNjAgMTkwIDI2MEgyMTBDMjYwLjIwNCAyNjAgMzAwIDMwMC4yOTQgMzAwIDM1MFYzODBIMTAwVjM1MFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
            }}
          />
          
          {/* Vibe Score Badge */}
          <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold">
            <Star className="h-4 w-4 inline mr-1" />
            {currentProfile.vibe}%
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold">{currentProfile.firstName}, {currentProfile.age}</h3>
            <Button size="sm" variant="outline">
              <Zap className="h-4 w-4 mr-1" />
              Spotlight
            </Button>
          </div>
          <p className="text-gray-600 mb-2">{currentProfile.bio}</p>
          <p className="text-sm text-gray-500">{currentProfile.distance}</p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-red-200 hover:bg-red-50"
          onClick={() => handleSwipe('left')}
        >
          <X className="h-6 w-6 text-red-600" />
        </Button>
        <Button
          size="lg"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
          onClick={() => handleSwipe('right')}
        >
          <Heart className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
