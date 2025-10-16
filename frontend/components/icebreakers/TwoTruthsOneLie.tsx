
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TwoTruthsOneLieProps {
  onSelect: (text: string) => void;
}

export default function TwoTruthsOneLie({ onSelect }: TwoTruthsOneLieProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [statements, setStatements] = useState([
    { text: 'I have traveled to more than 5 countries', isLie: false },
    { text: 'I can speak 3 languages fluently', isLie: true },
    { text: 'I have a pet dog named Max', isLie: false },
  ]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const handleSelect = (statement: { text: string; isLie: boolean }) => {
    if (selected) return;

    setSelected(statement.text);
    onSelect(statement.text);
    setIsCorrect(statement.isLie);
  };

  const lie = statements.find(s => s.isLie);

  if (!isPlaying && !selected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Two Truths, One Lie</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Ready to guess the lie?</p>
          <Button onClick={() => setIsPlaying(true)}>Let's Play!</Button>
        </CardContent>
      </Card>
    );
  }

  if (selected) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                {isCorrect ? (
                    <div>
                        <p className="font-bold text-lg text-green-500">You found the lie!</p>
                        <p>"{selected}" was indeed a lie.</p>
                    </div>
                ) : (
                    <div>
                        <p className="font-bold text-lg text-red-500">That was a truth!</p>
                        <p>The lie was: "{lie?.text}"</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guess the Lie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {statements.map((stmt) => (
            <Button
              key={stmt.text}
              variant="outline"
              className="w-full justify-start text-left h-auto py-2"
              onClick={() => handleSelect(stmt)}
            >
              {stmt.text}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
