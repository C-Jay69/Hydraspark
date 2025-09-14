import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Users, Shield, Zap, ArrowRight } from 'lucide-react';
import ModeSelection from '../components/onboarding/ModeSelection';
import VibeQuestions from '../components/onboarding/VibeQuestions';
import ProfileSetup from '../components/onboarding/ProfileSetup';
import SafetySetup from '../components/onboarding/SafetySetup';
import OnboardingComplete from '../components/onboarding/OnboardingComplete';

const steps = [
  { id: 'welcome', title: 'Welcome', component: null },
  { id: 'modes', title: 'Choose Modes', component: ModeSelection },
  { id: 'profile', title: 'Profile Setup', component: ProfileSetup },
  { id: 'vibes', title: 'Vibe Questions', component: VibeQuestions },
  { id: 'safety', title: 'Safety Setup', component: SafetySetup },
  { id: 'complete', title: 'Complete', component: OnboardingComplete },
];

function OnboardingFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    modes: ['dating'] as string[],
    profile: {
      bio: '',
      city: '',
      interests: [],
    },
    vibes: {},
    safety: {},
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleStepData = (stepData: any) => {
    const stepId = steps[currentStep].id;
    setOnboardingData(prev => ({
      ...prev,
      [stepId]: stepData,
    }));
  };

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;

  if (currentStep === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-12 w-12 text-blue-600" />
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-magenta-600 to-cyan-600 bg-clip-text text-transparent">
                HydraSpark
              </span>
            </div>
            <CardTitle className="text-3xl">Welcome, {user?.firstName}!</CardTitle>
            <CardDescription className="text-lg">
              Ignite Your Connections—Three Ways
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Dating Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Swipe, match, and chat with AI-powered vibe scores
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Friend Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Join communities and group events for platonic connections
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-magenta-200 bg-gradient-to-br from-magenta-50 to-pink-50">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-magenta-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Safety Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Check-ins, panic button, and trusted contacts for security
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">Vibe-Based Matching</Badge>
                <Badge variant="secondary">Interactive Icebreakers</Badge>
                <Badge variant="secondary">Video Stories</Badge>
                <Badge variant="secondary">Real-time Safety</Badge>
              </div>
              
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                size="lg"
              >
                Let's Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {steps.length - 1}</span>
            <span className="text-sm text-muted-foreground">{currentStepData.title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {StepComponent && (
          <StepComponent
            onNext={handleNext}
            onDataChange={handleStepData}
            initialData={onboardingData[currentStepData.id as keyof typeof onboardingData] as any}
          />
        )}
      </div>
    </div>
  );
}

export default OnboardingFlow;
