
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface GroupChatProps {
  groupName: string;
}

export default function GroupChat({ groupName }: GroupChatProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{groupName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64 bg-gray-100 rounded-lg p-4 overflow-y-auto">
          {/* Chat messages would go here */}
          <p className="text-sm text-gray-500">Chat placeholder</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Type a message..." />
          <Button>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
