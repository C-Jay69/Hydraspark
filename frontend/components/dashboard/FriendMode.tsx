import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Coffee, Music, Book } from 'lucide-react';

export default function FriendMode() {
  const events = [
    {
      id: '1',
      title: 'Coffee Meetup',
      date: 'Today, 3:00 PM',
      location: 'Downtown Cafe',
      attendees: 12,
      category: 'Social',
      icon: Coffee
    },
    {
      id: '2',
      title: 'Live Music Night',
      date: 'Tomorrow, 7:00 PM',
      location: 'The Blue Note',
      attendees: 25,
      category: 'Music',
      icon: Music
    },
    {
      id: '3',
      title: 'Book Club Discussion',
      date: 'Friday, 6:00 PM',
      location: 'Central Library',
      attendees: 8,
      category: 'Literature',
      icon: Book
    }
  ];

  const communities = [
    { name: 'Coffee Lovers', members: 1250, isJoined: true },
    { name: 'Tech Enthusiasts', members: 890, isJoined: false },
    { name: 'Hiking Adventures', members: 650, isJoined: true },
    { name: 'Foodies United', members: 2100, isJoined: false }
  ];

  return (
    <div className="space-y-6">
      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
          <CardDescription>
            Join group activities and meet new friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => {
              const IconComponent = event.icon;
              return (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{event.date}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.attendees} attending
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{event.category}</Badge>
                    <Button size="sm">Join</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Communities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Communities
          </CardTitle>
          <CardDescription>
            Connect with people who share your interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communities.map((community) => (
              <div key={community.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{community.name}</h4>
                  {community.isJoined ? (
                    <Badge className="bg-green-100 text-green-800">Joined</Badge>
                  ) : (
                    <Button size="sm" variant="outline">Join</Button>
                  )}
                </div>
                <p className="text-sm text-gray-600">{community.members.toLocaleString()} members</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}