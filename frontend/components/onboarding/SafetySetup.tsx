import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Plus, X, PhoneCall } from 'lucide-react';

interface SafetySetupProps {
  onNext: () => void;
  onDataChange: (data: any) => void;
  initialData?: any;
}

interface TrustedContact {
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

function SafetySetup({ onNext, onDataChange, initialData }: SafetySetupProps) {
  const [contacts, setContacts] = useState<TrustedContact[]>(initialData?.contacts || []);
  const [currentContact, setCurrentContact] = useState<TrustedContact>({
    name: '',
    phone: '',
    email: '',
    relationship: '',
  });

  const relationships = [
    'Friend',
    'Family Member',
    'Partner',
    'Roommate',
    'Colleague',
    'Other',
  ];

  const handleContactChange = (field: keyof TrustedContact, value: string) => {
    setCurrentContact(prev => ({ ...prev, [field]: value }));
  };

  const addContact = () => {
    if (currentContact.name && currentContact.phone && contacts.length < 3) {
      setContacts(prev => [...prev, currentContact]);
      setCurrentContact({ name: '', phone: '', email: '', relationship: '' });
    }
  };

  const removeContact = (index: number) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    onDataChange({ contacts });
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Safety First</CardTitle>
        <CardDescription>
          Add trusted contacts who will be notified in case of emergency. This is optional but highly recommended.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Safety Features Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">Your Safety Toolkit</h3>
          <div className="grid gap-2 text-sm text-green-700">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              <span>Check-in feature for dates with automatic alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              <span>Triple-tap panic button for emergencies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              <span>Safety score system with rewards</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              <span>Trusted contacts for emergency notifications</span>
            </div>
          </div>
        </div>

        {/* Existing Contacts */}
        {contacts.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Trusted Contacts ({contacts.length}/3)</label>
            {contacts.map((contact, index) => (
              <Card key={index} className="border border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <PhoneCall className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{contact.phone}</span>
                          {contact.relationship && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {contact.relationship}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContact(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Contact */}
        {contacts.length < 3 && (
          <Card className="border-2 border-dashed">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Trusted Contact
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Full name"
                    value={currentContact.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                  />
                  <Input
                    placeholder="Phone number"
                    type="tel"
                    value={currentContact.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Email (optional)"
                    type="email"
                    value={currentContact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                  />
                  <Select 
                    value={currentContact.relationship} 
                    onValueChange={(value) => handleContactChange('relationship', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map((rel) => (
                        <SelectItem key={rel} value={rel.toLowerCase()}>
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={addContact}
                  disabled={!currentContact.name || !currentContact.phone}
                  variant="outline"
                  className="w-full"
                >
                  Add Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {contacts.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              You can skip this step and add trusted contacts later in your safety settings.
            </p>
          </div>
        )}

        <div className="text-center pt-6">
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            size="lg"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SafetySetup;
