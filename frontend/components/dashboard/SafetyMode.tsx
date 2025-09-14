import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, MapPin, Phone, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SafetyMode() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const safetyScore = 25;
  const trustedContacts = [
    { name: 'Mom', phone: '+1-555-0123', verified: true },
    { name: 'Best Friend Sarah', phone: '+1-555-0456', verified: true }
  ];

  const handlePanicButton = () => {
    // This would trigger emergency alerts
    alert('Emergency alert sent to trusted contacts!');
  };

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  return (
    <div className="space-y-6">
      {/* Safety Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Safety Score: {safetyScore} points
          </CardTitle>
          <CardDescription>
            Earn points by using safety features and verifying your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Profile verified</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <span>Trusted contacts added</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <span>Check-in feature used</span>
              <Badge variant="outline">+5 points available</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-In Feature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Safety Check-In
          </CardTitle>
          <CardDescription>
            Let your trusted contacts know when and where you're meeting someone
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCheckedIn ? (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You're checked in at Downtown Cafe until 5:00 PM today. Your trusted contacts will be notified if you don't check out on time.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-4">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Set up a check-in before your next date for added safety.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <Button 
              className="w-full" 
              variant={isCheckedIn ? "outline" : "default"}
              onClick={handleCheckIn}
            >
              {isCheckedIn ? "Update Check-In" : "Start Check-In"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Panic Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Emergency Features
          </CardTitle>
          <CardDescription>
            Quick access to emergency help when you need it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              variant="destructive" 
              size="lg" 
              className="w-full"
              onClick={handlePanicButton}
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Emergency Alert
            </Button>
            <p className="text-sm text-gray-600 text-center">
              Triple-tap this button to send emergency alerts to your trusted contacts
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trusted Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Trusted Contacts
          </CardTitle>
          <CardDescription>
            People who will be notified in case of emergency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trustedContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                </div>
                {contact.verified && (
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                )}
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Add Trusted Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}