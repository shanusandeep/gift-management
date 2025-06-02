
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Calendar, Gift, Edit, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface Recipient {
  id: string;
  name: string;
  birthday?: string;
  anniversary?: string;
  preferences: string;
  contactInfo?: string;
  email?: string;
  phone?: string;
  giftHistory: Array<{
    giftName: string;
    occasion: string;
    date: string;
    price: number;
  }>;
}

const RecipientManager = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      birthday: '1995-06-15',
      preferences: 'Loves tech gadgets, coffee, and reading sci-fi novels',
      email: 'sarah@email.com',
      phone: '+1-555-0123',
      giftHistory: [
        { giftName: 'Wireless Headphones', occasion: 'Birthday', date: '2024-06-15', price: 89 },
        { giftName: 'Coffee Subscription', occasion: 'Christmas', date: '2023-12-25', price: 45 }
      ]
    },
    {
      id: '2',
      name: 'Tom Wilson',
      birthday: '2015-03-22',
      preferences: 'LEGO sets, video games, superheroes',
      giftHistory: [
        { giftName: 'LEGO Building Set', occasion: 'Birthday', date: '2024-03-22', price: 45 }
      ]
    },
    {
      id: '3',
      name: 'Mom & Dad',
      anniversary: '1985-08-10',
      preferences: 'Home decor, wine, travel experiences',
      giftHistory: [
        { giftName: 'Wine Tasting Experience', occasion: 'Anniversary', date: '2023-08-10', price: 150 }
      ]
    }
  ]);

  const [newRecipient, setNewRecipient] = useState<Partial<Recipient>>({});
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);

  const handleAddRecipient = () => {
    if (!newRecipient.name) {
      toast.error("Please enter a name");
      return;
    }

    const recipient: Recipient = {
      id: Date.now().toString(),
      name: newRecipient.name || '',
      birthday: newRecipient.birthday,
      anniversary: newRecipient.anniversary,
      preferences: newRecipient.preferences || '',
      email: newRecipient.email,
      phone: newRecipient.phone,
      giftHistory: []
    };

    setRecipients([...recipients, recipient]);
    setNewRecipient({});
    setIsAddingRecipient(false);
    toast.success("Recipient added successfully!");
  };

  const getUpcomingEvent = (recipient: Recipient) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    const events = [];
    
    if (recipient.birthday) {
      const birthday = new Date(recipient.birthday);
      const thisYearBirthday = new Date(currentYear, birthday.getMonth(), birthday.getDate());
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(currentYear + 1);
      }
      events.push({ type: 'birthday', date: thisYearBirthday });
    }
    
    if (recipient.anniversary) {
      const anniversary = new Date(recipient.anniversary);
      const thisYearAnniversary = new Date(currentYear, anniversary.getMonth(), anniversary.getDate());
      if (thisYearAnniversary < today) {
        thisYearAnniversary.setFullYear(currentYear + 1);
      }
      events.push({ type: 'anniversary', date: thisYearAnniversary });
    }
    
    if (events.length === 0) return null;
    
    events.sort((a, b) => a.date.getTime() - b.date.getTime());
    const nextEvent = events[0];
    
    const daysUntil = Math.ceil((nextEvent.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      type: nextEvent.type,
      daysUntil,
      date: nextEvent.date
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Recipient Management</h2>
          <p className="text-gray-600">Manage people you give gifts to</p>
        </div>
        <Dialog open={isAddingRecipient} onOpenChange={setIsAddingRecipient}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Recipient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Recipient</DialogTitle>
              <DialogDescription>Add someone new to your gift list</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newRecipient.name || ''}
                  onChange={(e) => setNewRecipient({...newRecipient, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={newRecipient.birthday || ''}
                  onChange={(e) => setNewRecipient({...newRecipient, birthday: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anniversary">Anniversary</Label>
                <Input
                  id="anniversary"
                  type="date"
                  value={newRecipient.anniversary || ''}
                  onChange={(e) => setNewRecipient({...newRecipient, anniversary: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newRecipient.email || ''}
                  onChange={(e) => setNewRecipient({...newRecipient, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newRecipient.phone || ''}
                  onChange={(e) => setNewRecipient({...newRecipient, phone: e.target.value})}
                  placeholder="+1-555-0123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferences">Preferences & Interests</Label>
                <Textarea
                  id="preferences"
                  value={newRecipient.preferences || ''}
                  onChange={(e) => setNewRecipient({...newRecipient, preferences: e.target.value})}
                  placeholder="What do they like? Hobbies, favorite colors, interests..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingRecipient(false)}>Cancel</Button>
              <Button onClick={handleAddRecipient}>Add Recipient</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipients.map((recipient) => {
          const upcomingEvent = getUpcomingEvent(recipient);
          
          return (
            <Card 
              key={recipient.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedRecipient(recipient)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{recipient.name}</CardTitle>
                    {upcomingEvent && (
                      <CardDescription>
                        {upcomingEvent.type} in {upcomingEvent.daysUntil} days
                      </CardDescription>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    // Edit functionality
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {upcomingEvent && (
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">
                        {upcomingEvent.type === 'birthday' ? '🎂' : '💕'} Next {upcomingEvent.type}
                      </span>
                      <Badge variant="default">{upcomingEvent.daysUntil} days</Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gifts given:</span>
                    <span className="font-medium">{recipient.giftHistory.length}</span>
                  </div>
                  
                  {recipient.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-3 w-3 mr-1" />
                      {recipient.email}
                    </div>
                  )}
                  
                  {recipient.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-3 w-3 mr-1" />
                      {recipient.phone}
                    </div>
                  )}
                  
                  {recipient.preferences && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {recipient.preferences}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recipient Detail Dialog */}
      <Dialog open={!!selectedRecipient} onOpenChange={() => setSelectedRecipient(null)}>
        <DialogContent className="max-w-2xl">
          {selectedRecipient && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRecipient.name}</DialogTitle>
                <DialogDescription>Gift history and details</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedRecipient.birthday && (
                    <div>
                      <Label className="text-sm font-medium">Birthday</Label>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedRecipient.birthday).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedRecipient.anniversary && (
                    <div>
                      <Label className="text-sm font-medium">Anniversary</Label>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedRecipient.anniversary).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Preferences */}
                {selectedRecipient.preferences && (
                  <div>
                    <Label className="text-sm font-medium">Preferences & Interests</Label>
                    <p className="text-sm text-gray-600 mt-1">{selectedRecipient.preferences}</p>
                  </div>
                )}

                {/* Gift History */}
                <div>
                  <Label className="text-sm font-medium">Gift History</Label>
                  <div className="mt-2 space-y-2">
                    {selectedRecipient.giftHistory.length > 0 ? (
                      selectedRecipient.giftHistory.map((gift, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{gift.giftName}</p>
                            <p className="text-sm text-gray-600">{gift.occasion} • {new Date(gift.date).toLocaleDateString()}</p>
                          </div>
                          <span className="font-medium">${gift.price}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No gifts given yet</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipientManager;
