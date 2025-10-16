
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

const dummyUsers = [
  { id: '1', name: 'Alice', interests: ['Hiking', 'Photography', 'Cooking'] },
  { id: '2', name: 'Bob', interests: ['Gaming', 'Movies', 'Coding'] },
  { id: '3', name: 'Charlie', interests: ['Music', 'Art', 'Traveling'] },
];

export default function FindPeople() {
  return (
    <Card>
      <CardContent className="pt-6">
        <ul className="space-y-4">
          {dummyUsers.map((user) => (
            <li key={user.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">{user.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.interests.map((interest) => (
                    <span key={interest} className="px-2 py-1 bg-gray-200 rounded-full text-xs">{interest}</span>
                  ))}
                </div>
              </div>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Send Friend Request
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
