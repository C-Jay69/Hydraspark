
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const dummyGroups = [
  { id: '1', name: 'Dog Lovers', description: 'A group for people who love dogs.' },
  { id: '2', name: 'Foodies', description: 'Share your favorite recipes and restaurants.' },
  { id: '3', name: 'Hikers', description: 'Explore the great outdoors together.' },
];

export default function GroupList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {dummyGroups.map((group) => (
            <li key={group.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">{group.name}</h3>
                <p className="text-sm text-gray-600">{group.description}</p>
              </div>
              <Button>Join</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
