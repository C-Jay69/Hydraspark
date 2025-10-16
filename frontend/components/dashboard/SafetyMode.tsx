
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, MapPin, Phone, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';
import AddTrustedContactForm from './AddTrustedContactForm';
import CheckInForm from './CheckInForm';

// Define the type for a trusted contact, including the ID
interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  verified: boolean;
}

// Define the type for a check-in, ensuring endTime is a string as returned by the API
interface CheckIn {
  location: string;
  endTime: string;
}

export default function SafetyMode() {
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const safetyScore = 25;
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);

  // Fetch initial data for trusted contacts and check-in status
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch trusted contacts
        const contactsResponse = await fetch('/api/safety/trusted-contacts');
        if (contactsResponse.ok) {
          const data = await contactsResponse.json();
          setTrustedContacts(data.contacts);
        } else {
          console.error('Failed to fetch trusted contacts');
        }

        // Fetch check-in status
        const checkInResponse = await fetch('/api/safety/check-in');
        if (checkInResponse.ok) {
          const data = await checkInResponse.json();
          if (data.checkIn) {
            setCheckIn(data.checkIn);
          }
        } else {
          console.error('Failed to fetch check-in status');
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const handlePanicButton = () => {
    alert('Emergency alert sent to trusted contacts!');
  };

  // Handle starting a check-in
  const handleStartCheckIn = async (location: string, duration: number) => {
    try {
      const response = await fetch('/api/safety/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, duration }),
      });

      if (response.ok) {
        const newCheckIn = await response.json();
        setCheckIn(newCheckIn);
        setIsCheckingIn(false);
      } else {
        console.error('Failed to start check-in');
      }
    } catch (error) {
      console.error('Error starting check-in:', error);
    }
  };

  // Handle ending a check-in
  const handleEndCheckIn = async () => {
    try {
      const response = await fetch('/api/safety/check-in', {
        method: 'DELETE',
      });

      if (response.ok) {
        setCheckIn(null);
      } else {
        console.error('Failed to end check-in');
      }
    } catch (error) {
      console.error('Error ending check-in:', error);
    }
  };

  // Handle adding a new contact
  const handleAddContact = async (name: string, phone: string) => {
    try {
      const response = await fetch('/api/safety/trusted-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });

      if (response.ok) {
        const newContact = await response.json();
        setTrustedContacts([...trustedContacts, newContact]);
        setIsAddingContact(false);
      } else {
        console.error('Failed to add trusted contact');
      }
    } catch (error) {
      console.error('Error adding trusted contact:', error);
    }
  };

  // Handle removing a contact
  const handleRemoveContact = async (id: string) => {
    if (!confirm('Are you sure you want to remove this trusted contact?')) {
      return;
    }

    try {
      const response = await fetch(`/api/safety/trusted-contacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTrustedContacts(trustedContacts.filter((contact) => contact.id !== id));
      } else {
        console.error('Failed to remove trusted contact');
      }
    } catch (error) {
      console.error('Error removing trusted contact:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Safety Score Card... */}
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
              {trustedContacts.length > 0 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Badge variant="outline"> +10 points available</Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>Check-in feature used</span>
              {checkIn ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Badge variant="outline">+5 points available</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-In Feature Card */}
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
          {isCheckingIn ? (
            <CheckInForm onCheckIn={handleStartCheckIn} onCancel={() => setIsCheckingIn(false)} />
          ) : checkIn ? (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You're checked in at {checkIn.location} until {new Date(checkIn.endTime).toLocaleTimeString()}. Your trusted contacts will be notified if you don't check out on time.
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

          {!isCheckingIn && (
            <div className="space-y-4">
              <Button
                className="w-full"
                variant={checkIn ? "outline" : "default"}
                onClick={() => (checkIn ? handleEndCheckIn() : setIsCheckingIn(true))}
              >
                {checkIn ? "End Check-In" : "Start Check-In"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panic Button Card... */}
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

      {/* Trusted Contacts Card */}
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
          {isAddingContact ? (
            <AddTrustedContactForm onAdd={handleAddContact} onCancel={() => setIsAddingContact(false)} />
          ) : (
            <div className="space-y-3">
              {trustedContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {contact.verified ? (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveContact(contact.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => setIsAddingContact(true)}>
                Add Trusted Contact
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
