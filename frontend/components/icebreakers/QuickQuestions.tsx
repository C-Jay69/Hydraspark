
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickQuestionsProps {
  question: {
    question: string;
  };
}

export default function QuickQuestions({ question }: QuickQuestionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Question</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{question.question}</p>
      </CardContent>
    </Card>
  );
}
