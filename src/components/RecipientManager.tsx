
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Calendar, Gift, Edit, Phone, Mail, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRecipients } from '@/hooks/useRecipients';
import { useGifts } from '@/hooks/useGifts';

const RecipientManager = () => {
  const { recipients, loading: recipientsLoading, addRecipient, updateRecipient, deleteRecipient } = useRecipients();
  const { gifts, loading: giftsLoading } = useGifts();
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    anniversary: '',
    email: '',
    phone: '',
    preferences: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    try {
      const recipientData = {
        ...formData,
        birthday: formData.birthday || null,
        anniversary: formData.anniversary || null,
        email: formData.email || null,
        phone: formData.phone || null,
        preferences: formData.preferences || null
      };

      if (editingRecipient) {
        await updateRecipient(editingRecipient.id, recipientData);
        setEditingRecipient(null);
      } else {
        await addRecipient(recipientData);
      }
      
      setFormData({
        name: '',
        birthday: '',
        anniversary: '',
        email: '',
        phone: '',
        preferences: ''
      });
      setIsAddingRecipient(false);
    } catch (error) {
      console.error('Error saving recipient:', error);
    }
  };

  const handleEdit = (recipient) => {
    setEditingRecipient(recipient);
    setFormData({
      name: recipient.name || '',
      birthday: recipient.birthday || '',
      anniversary: recipient.anniversary || '',
      email: recipient.email || '',
      phone: recipient.phone || '',
      preferences: recipient.preferences || ''
    });
    setIsAddingRecipient(true);
  };

  const handleDelete = async (recipientId) => {
    if (window.confirm('Are you sure you want to delete this recipient? This will also remove them from any associated gifts.')) {
      await deleteRecipient(recipientId);
    }
  };

  const getUpcomingEvent = (recipient) => {
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

  const getRecipientGifts = (recipientId) => {
    return gifts.filter(gift => gift.recipient_id === recipientId);
  };

  if (recipientsLoading || giftsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-emerald-600">Loading recipients...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Recipient Management
          </h2>
          <p className="text-gray-600 mt-2">Manage people you give gifts to</p>
        </div>
        <Dialog open={isAddingRecipient} onOpenChange={setIsAddingRecipient}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Recipient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingRecipient ? 'Edit Recipient' : 'Add New Recipient'}</DialogTitle>
              <DialogDescription>
                {editingRecipient ? 'Update recipient information' : 'Add someone new to your gift list'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anniversary">Anniversary</Label>
                <Input
                  id="anniversary"
                  type="date"
                  value={formData.anniversary}
                  onChange={(e) => setFormData({...formData, anniversary: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1-555-0123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferences">Preferences & Interests</Label>
                <Textarea
                  id="preferences"
                  value={formData.preferences}
                  onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                  placeholder="What do they like? Hobbies, favorite colors, interests..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => {
                    setIsAddingRecipient(false);
                    setEditingRecipient(null);
                    setFormData({
                      name: '',
                      birthday: '',
                      anniversary: '',
                      email: '',
                      phone: '',
                      preferences: ''
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                  {editingRecipient ? 'Update Recipient' : 'Add Recipient'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {recipients.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipients yet</h3>
            <p className="text-gray-500 mb-4">Start by adding people you give gifts to</p>
            <Button 
              onClick={() => setIsAddingRecipient(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Recipient
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipients.map((recipient) => {
            const upcomingEvent = getUpcomingEvent(recipient);
            const recipientGifts = getRecipientGifts(recipient.id);
            
            return (
              <Card 
                key={recipient.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-lg bg-white/70 backdrop-blur-sm group"
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
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(recipient);
                        }}
                        className="h-8 w-8 p-0 hover:bg-blue-100"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(recipient.id);
                        }}
                        className="h-8 w-8 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {upcomingEvent && (
                      <div className="flex items-center justify-between p-2 bg-emerald-50 rounded">
                        <span className="text-sm font-medium">
                          {upcomingEvent.type === 'birthday' ? '🎂' : '💕'} Next {upcomingEvent.type}
                        </span>
                        <Badge variant="default" className="bg-emerald-500">{upcomingEvent.daysUntil} days</Badge>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Gifts given:</span>
                      <span className="font-medium">{recipientGifts.length}</span>
                    </div>
                    
                    {recipient.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        <span className="truncate">{recipient.email}</span>
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
      )}

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
                  {selectedRecipient.email && (
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-gray-600">{selectedRecipient.email}</p>
                    </div>
                  )}
                  {selectedRecipient.phone && (
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm text-gray-600">{selectedRecipient.phone}</p>
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
                    {getRecipientGifts(selectedRecipient.id).length > 0 ? (
                      getRecipientGifts(selectedRecipient.id).map((gift) => (
                        <div key={gift.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{gift.name}</p>
                            <p className="text-sm text-gray-600">
                              {gift.occasion && `${gift.occasion} • `}
                              {gift.date_given ? new Date(gift.date_given).toLocaleDateString() : 'Date not set'}
                            </p>
                          </div>
                          {gift.price && <span className="font-medium">${gift.price}</span>}
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
