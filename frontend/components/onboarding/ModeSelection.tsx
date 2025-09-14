import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Users, ArrowRight } from 'lucide-react';

interface ModeSelectionProps {
  onNext: () => void;
  onDataChange: (data: any) => void;
  initialData?: any;
}

function ModeSelection({ onNext, onDataChange, initialData }: ModeSelectionProps) {
  const [selectedModes, setSelectedModes] = useState<string[]>(
    initialData?.modes || ['dating']
  );

  const modes = [
    {
      id: 'dating',
      title: 'Dating Mode',
      description: 'Find romantic connections with vibe-based matching',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'friend',
      title: 'Friend Mode', 
      description: 'Make platonic friends and join group activities',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const handleModeToggle = (modeId: string) => {
    setSelectedModes(prev => {
      const updated = prev.includes(modeId)
        ? prev.filter(id => id !== modeId)
        : [...prev, modeId];
      
      // Ensure at least one mode is selected
      return updated.length === 0 ? ['dating'] : updated;
    });
  };

  const handleNext = () => {
    onDataChange({ modes: selectedModes });
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose Your Connection Style</CardTitle>
        <CardDescription>
          Select how you want to connect on HydraSpark. You can always change this later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedModes.includes(mode.id);
            
            return (
              <Card 
                key={mode.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleModeToggle(mode.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Checkbox 
                      checked={isSelected}
                      onChange={() => handleModeToggle(mode.id)}
                      className="mt-1"
                    />
                    <div className={`p-3 rounded-full bg-gradient-to-r ${mode.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{mode.title}</h3>
                      <p className="text-muted-foreground">{mode.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center pt-6">
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            size="lg"
            disabled={selectedModes.length === 0}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ModeSelection;
