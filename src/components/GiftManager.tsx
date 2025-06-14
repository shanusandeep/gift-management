
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Gift, Edit, Trash2, Upload, DollarSign, Tag, User, Calendar, Loader2 } from "lucide-react";
import { useGifts } from '@/hooks/useGifts';
import { useRecipients } from '@/hooks/useRecipients';
import { toast } from 'sonner';

const GiftManager = () => {
  const { gifts, loading: giftsLoading, addGift, updateGift, deleteGift } = useGifts();
  const { recipients, loading: recipientsLoading } = useRecipients();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    recipient_id: '',
    occasion: '',
    age_group: '',
    gender: '',
    price: '',
    status: 'available',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Gift name is required');
      return;
    }

    try {
      const giftData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        recipient_id: formData.recipient_id || null
      };

      if (editingGift) {
        await updateGift(editingGift.id, giftData);
        setEditingGift(null);
      } else {
        await addGift(giftData);
      }
      
      setFormData({
        name: '',
        category: '',
        recipient_id: '',
        occasion: '',
        age_group: '',
        gender: '',
        price: '',
        status: 'available',
        notes: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving gift:', error);
    }
  };

  const handleEdit = (gift) => {
    setEditingGift(gift);
    setFormData({
      name: gift.name || '',
      category: gift.category || '',
      recipient_id: gift.recipient_id || '',
      occasion: gift.occasion || '',
      age_group: gift.age_group || '',
      gender: gift.gender || '',
      price: gift.price ? gift.price.toString() : '',
      status: gift.status || 'available',
      notes: gift.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (giftId) => {
    if (window.confirm('Are you sure you want to delete this gift?')) {
      await deleteGift(giftId);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-500';
      case 'wrapped': return 'bg-blue-500';
      case 'purchased': return 'bg-yellow-500';
      case 'available': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRecipientName = (recipientId) => {
    const recipient = recipients.find(r => r.id === recipientId);
    return recipient ? recipient.name : 'No recipient';
  };

  if (giftsLoading || recipientsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-emerald-600">Loading gifts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Gift Collection
          </h2>
          <p className="text-gray-600 mt-2">Manage and organize all your gifts</p>
        </div>
        <Button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingGift(null);
            setFormData({
              name: '',
              category: '',
              recipient_id: '',
              occasion: '',
              age_group: '',
              gender: '',
              price: '',
              status: 'available',
              notes: ''
            });
          }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {editingGift ? 'Cancel Edit' : 'Add New Gift'}
        </Button>
      </div>

      {/* Add/Edit Gift Form */}
      {showAddForm && (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              {editingGift ? 'Edit Gift' : 'Add New Gift'}
            </CardTitle>
            <CardDescription className="text-emerald-100">
              {editingGift ? 'Update gift details' : 'Fill in the details for your new gift'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="giftName" className="text-sm font-semibold text-gray-700">Gift Name *</Label>
                  <Input 
                    id="giftName" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter gift name" 
                    className="border-2 border-gray-200 focus:border-emerald-400 rounded-lg" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category</Label>
                  <Input 
                    id="category" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g., Electronics, Toys" 
                    className="border-2 border-gray-200 focus:border-emerald-400 rounded-lg" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-sm font-semibold text-gray-700">Recipient</Label>
                  <Select value={formData.recipient_id} onValueChange={(value) => setFormData({...formData, recipient_id: value})}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-emerald-400 rounded-lg">
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No recipient</SelectItem>
                      {recipients.map((recipient) => (
                        <SelectItem key={recipient.id} value={recipient.id}>
                          {recipient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occasion" className="text-sm font-semibold text-gray-700">Occasion</Label>
                  <Input 
                    id="occasion" 
                    value={formData.occasion}
                    onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                    placeholder="e.g., Birthday, Christmas" 
                    className="border-2 border-gray-200 focus:border-emerald-400 rounded-lg" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageGroup" className="text-sm font-semibold text-gray-700">Age Group</Label>
                  <Select value={formData.age_group} onValueChange={(value) => setFormData({...formData, age_group: value})}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-emerald-400 rounded-lg">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Teenager">Teenager</SelectItem>
                      <SelectItem value="Adult">Adult</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-emerald-400 rounded-lg">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-semibold text-gray-700">Price</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00" 
                    className="border-2 border-gray-200 focus:border-emerald-400 rounded-lg" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-emerald-400 rounded-lg">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="purchased">Purchased</SelectItem>
                      <SelectItem value="wrapped">Wrapped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes about this gift..."
                  className="border-2 border-gray-200 focus:border-emerald-400 rounded-lg"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex-1">
                  {editingGift ? 'Update Gift' : 'Save Gift'}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingGift(null);
                  }} 
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Gifts Grid */}
      {gifts.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No gifts yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first gift to your collection</p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Gift
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts.map((gift) => (
            <Card key={gift.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                      <Gift className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-800">{gift.name}</CardTitle>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                      onClick={() => handleEdit(gift)}
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-red-100"
                      onClick={() => handleDelete(gift.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {gift.category && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Tag className="h-3 w-3" />
                      <span>{gift.category}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-3 w-3" />
                    <span>{getRecipientName(gift.recipient_id)}</span>
                  </div>
                  {gift.occasion && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{gift.occasion}</span>
                    </div>
                  )}
                  {gift.price && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-3 w-3" />
                      <span>${gift.price}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {gift.age_group && (
                    <Badge variant="outline" className="text-xs bg-gray-100">
                      {gift.age_group}
                    </Badge>
                  )}
                  {gift.gender && (
                    <Badge variant="outline" className="text-xs bg-gray-100">
                      {gift.gender}
                    </Badge>
                  )}
                  <Badge className={`text-white text-xs ${getStatusColor(gift.status)}`}>
                    {gift.status}
                  </Badge>
                </div>

                {gift.date_given && (
                  <p className="text-xs text-gray-500 border-t pt-3">
                    Given on: {new Date(gift.date_given).toLocaleDateString()}
                  </p>
                )}

                {gift.notes && (
                  <p className="text-xs text-gray-600 italic border-t pt-3">
                    {gift.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GiftManager;
