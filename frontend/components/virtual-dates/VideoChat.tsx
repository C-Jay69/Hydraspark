
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Video, Mic, ShareScreen } from 'lucide-react';

interface VideoChatProps {
  onEndCall: () => void;
}

export default function VideoChat({ onEndCall }: VideoChatProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Virtual Date</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-[16/9] bg-gray-900 rounded-lg flex items-center justify-center text-white">
          {/* This is where the video streams would go */}
          <p>Video chat placeholder</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="icon">
            <Mic className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="destructive" size="icon" onClick={onEndCall}>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <ShareScreen className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
