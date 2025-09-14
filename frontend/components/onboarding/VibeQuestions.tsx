import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';

interface VibeQuestionsProps {
  onNext: () => void;
  onDataChange: (data: any) => void;
  initialData?: any;
}

function VibeQuestions({ onNext, onDataChange, initialData }: VibeQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialData?.answers || {});

  const { data: questionsData } = useQuery({
    queryKey: ['vibe-questions'],
    queryFn: () => backend.auth.getVibeQuestions(),
  });

  const questions = questionsData?.questions || [];

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    onDataChange({ answers });
    onNext();
  };

  const answeredCount = Object.keys(answers).length;
  const canContinue = answeredCount >= Math.min(3, questions.length); // At least 3 questions

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Share Your Vibe</CardTitle>
        <CardDescription>
          Answer these fun questions to help us find your perfect matches
        </CardDescription>
        <div className="text-sm text-muted-foreground">
          {answeredCount} of {questions.length} answered (minimum 3 required)
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question) => (
          <Card key={question.id} className="border-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
              <div className="grid gap-2">
                {question.options.map((option) => (
                  <Button
                    key={option}
                    variant={answers[question.id.toString()] === option ? "default" : "outline"}
                    className={`justify-start text-left h-auto p-4 ${
                      answers[question.id.toString()] === option 
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" 
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(question.id.toString(), option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="text-center pt-6">
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            size="lg"
            disabled={!canContinue}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {!canContinue && (
            <p className="text-sm text-muted-foreground mt-2">
              Answer at least 3 questions to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default VibeQuestions;
