
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TwoTruthsOneLieProps {
  statements: { text: string; isLie: boolean }[];
}

export default function TwoTruthsOneLie({ statements }: TwoTruthsOneLieProps) {
    const [revealed, setRevealed] = useState(false);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Two Truths and a Lie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {statements.map((stmt, index) => (
                    <div key={index} className={`p-2 rounded ${revealed ? (stmt.isLie ? 'bg-red-200' : 'bg-green-200') : 'bg-gray-100'}`}>
                        {stmt.text}
                    </div>
                ))}
                {!revealed && (
                    <Button onClick={() => setRevealed(true)} className="mt-2">Reveal Lie</Button>
                )}
            </CardContent>
        </Card>
    );
}
