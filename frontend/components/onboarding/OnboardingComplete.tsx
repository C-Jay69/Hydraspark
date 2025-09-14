import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Heart, Users, Shield, Sparkles } from 'lucide-react';

interface OnboardingCompleteProps {
  onNext: () => void;
  onDataChange: (data: any) => void;
  initialData?: any;
}

function OnboardingComplete({ onNext }: OnboardingCompleteProps) {
  const completedFeatures = [
    { icon: Heart, title: 'Dating Mode Ready', description: 'Start swiping and matching' },
    { icon: Users, title: 'Friend Mode Available', description: 'Join communities and events' },
    { icon: Shield, title: 'Safety Features Active', description: 'Check-in and panic button ready' },
    { icon: Sparkles, title: 'Vibe Score Calculated', description: 'AI-powered compatibility matching' },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="relative">
            <Zap className="h-16 w-16 text-blue-600" />
            <CheckCircle className="h-6 w-6 text-green-600 bg-white rounded-full absolute -top-1 -right-1" />
          </div>
        </div>
        <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 via-magenta-600 to-cyan-600 bg-clip-text text-transparent">
          You're All Set!
        </CardTitle>
        <CardDescription className="text-lg">
          Welcome to HydraSpark - Your connections start now
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completion Status */}
        <div className="grid gap-4">
          {completedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="p-2 bg-green-100 rounded-full">
                  <Icon className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800">{feature.title}</h3>
                  <p className="text-sm text-green-700">{feature.description}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            );
          })}
        </div>

        {/* Safety Score */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold">Safety Score</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">25 pts</div>
            <p className="text-sm text-blue-700 mb-3">Great start! Keep building your safety score.</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">Profile Verified</Badge>
              <Badge variant="secondary">Basic Setup Complete</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-3">What's Next?</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span>Complete your profile verification for higher matches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span>Add photos and video story to stand out</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span>Set up your first safety check-in before dating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span>Explore virtual date options and group events</span>
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            size="lg"
          >
            Start Connecting
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Ready to ignite your connections? Let's go!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default OnboardingComplete;
