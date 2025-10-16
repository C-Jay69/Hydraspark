
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CheckInFormProps {
  onCheckIn: (location: string, duration: number) => void;
  onCancel: () => void;
}

export default function CheckInForm({ onCheckIn, onCancel }: CheckInFormProps) {
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState(60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && duration > 0) {
      onCheckIn(location, duration);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a Safety Check-In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Downtown Cafe"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (in minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              required
              min="15"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Start Check-In</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
