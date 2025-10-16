
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const dummyEvents = [
  { id: '1', name: 'Weekly Meetup', description: 'Casual get-together at the local coffee shop.', date: '2024-08-01' },
  { id: '2', name: 'Summer Picnic', description: 'Enjoy the sun and good company.', date: '2024-08-15' },
  { id: '3', name: 'Game Night', description: 'Board games, video games, and more!', date: '2024-08-22' },
];

export default function EventManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Events</CardTitle>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Create Event'}
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {dummyEvents.map((event) => (
              <li key={event.id} className="p-4 border rounded-lg">
                <h3 className="font-bold">{event.name}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-xs text-gray-500 mt-2">{event.date}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Event Name" />
            <Textarea placeholder="Event Description" />
            <Input type="date" />
            <Button>Submit</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
