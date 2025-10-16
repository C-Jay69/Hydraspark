
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Coffee, Music, Book } from 'lucide-react';
import GroupList from '../groups/GroupList';
import FindPeople from '../friend/FindPeople';

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

  return (
    <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="find-people">Find People</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
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
        </TabsContent>
        <TabsContent value="groups">
            <GroupList />
        </TabsContent>
        <TabsContent value="find-people">
            <FindPeople />
        </TabsContent>
    </Tabs>
  );
}
