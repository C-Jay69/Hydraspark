
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WouldYouRatherProps {
  question: {
    optionA: string;
    optionB: string;
  };
  onSelect: (option: string) => void;
}

export default function WouldYouRather({ question, onSelect }: WouldYouRatherProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Would You Rather...</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => onSelect(question.optionA)} className="w-full">
          {question.optionA}
        </Button>
        <div className="text-center text-sm font-bold">OR</div>
        <Button onClick={() => onSelect(question.optionB)} className="w-full">
          {question.optionB}
        </Button>
      </CardContent>
    </Card>
  );
}
