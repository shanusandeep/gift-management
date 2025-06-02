
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Upload, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Gift {
  id: string;
  name: string;
  category: string;
  source: string;
  sourceFrom?: string;
  recipient?: string;
  occasion: string;
  ageGroup: string;
  gender: string;
  price: number;
  status: string;
  dateGiven?: string;
  imageUrl?: string;
}

const GiftManager = () => {
  const [gifts, setGifts] = useState<Gift[]>([
    {
      id: '1',
      name: 'Wireless Headphones',
      category: 'Electronics',
      source: 'bought',
      recipient: 'Sarah',
      occasion: 'Birthday',
      ageGroup: 'adult',
      gender: 'female',
      price: 89,
      status: 'purchased',
      dateGiven: '2024-06-15'
    },
    {
      id: '2',
      name: 'LEGO Building Set',
      category: 'Toys',
      source: 'bought',
      recipient: 'Tom',
      occasion: 'Birthday',
      ageGroup: 'child',
      gender: 'male',
      price: 45,
      status: 'wrapped'
    }
  ]);

  const [newGift, setNewGift] = useState<Partial<Gift>>({});
  const [isAddingGift, setIsAddingGift] = useState(false);

  const handleAddGift = () => {
    if (!newGift.name || !newGift.category) {
      toast.error("Please fill in required fields");
      return;
    }

    const gift: Gift = {
      id: Date.now().toString(),
      name: newGift.name || '',
      category: newGift.category || '',
      source: newGift.source || 'bought',
      sourceFrom: newGift.sourceFrom,
      recipient: newGift.recipient,
      occasion: newGift.occasion || '',
      ageGroup: newGift.ageGroup || 'adult',
      gender: newGift.gender || 'unisex',
      price: newGift.price || 0,
      status: newGift.status || 'available',
      dateGiven: newGift.dateGiven,
      imageUrl: newGift.imageUrl
    };

    setGifts([...gifts, gift]);
    setNewGift({});
    setIsAddingGift(false);
    toast.success("Gift added successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'secondary';
      case 'purchased': return 'default';
      case 'wrapped': return 'outline';
      case 'delivered': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gift Management</h2>
          <p className="text-gray-600">Manage your gift inventory and history</p>
        </div>
        <Dialog open={isAddingGift} onOpenChange={setIsAddingGift}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Gift
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Gift</DialogTitle>
              <DialogDescription>Add a new gift to your inventory</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Gift Name *</Label>
                <Input
                  id="name"
                  value={newGift.name || ''}
                  onChange={(e) => setNewGift({...newGift, name: e.target.value})}
                  placeholder="Enter gift name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={newGift.category} onValueChange={(value) => setNewGift({...newGift, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toys">Toys</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Gift Source</Label>
                <Select value={newGift.source} onValueChange={(value) => setNewGift({...newGift, source: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bought">Bought</SelectItem>
                    <SelectItem value="gifted">Gifted</SelectItem>
                    <SelectItem value="reviewProduct">Review Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newGift.source === 'gifted' && (
                <div className="space-y-2">
                  <Label htmlFor="sourceFrom">From Whom</Label>
                  <Input
                    id="sourceFrom"
                    value={newGift.sourceFrom || ''}
                    onChange={(e) => setNewGift({...newGift, sourceFrom: e.target.value})}
                    placeholder="Who gave this gift?"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="ageGroup">Age Group</Label>
                <Select value={newGift.ageGroup} onValueChange={(value) => setNewGift({...newGift, ageGroup: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="child">Child (0-12)</SelectItem>
                    <SelectItem value="teenager">Teenager (13-19)</SelectItem>
                    <SelectItem value="adult">Adult (20-64)</SelectItem>
                    <SelectItem value="senior">Senior (65+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={newGift.gender} onValueChange={(value) => setNewGift({...newGift, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newGift.price || ''}
                  onChange={(e) => setNewGift({...newGift, price: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newGift.status} onValueChange={(value) => setNewGift({...newGift, status: value})}>
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label htmlFor="occasion">Occasion</Label>
                <Input
                  id="occasion"
                  value={newGift.occasion || ''}
                  onChange={(e) => setNewGift({...newGift, occasion: e.target.value})}
                  placeholder="e.g., Birthday, Anniversary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  value={newGift.recipient || ''}
                  onChange={(e) => setNewGift({...newGift, recipient: e.target.value})}
                  placeholder="Who is this for?"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingGift(false)}>Cancel</Button>
              <Button onClick={handleAddGift}>Add Gift</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gifts.map((gift) => (
          <Card key={gift.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{gift.name}</CardTitle>
                  <CardDescription>{gift.category}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant={getStatusColor(gift.status)}>{gift.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="font-medium">${gift.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age Group:</span>
                  <span className="text-sm">{gift.ageGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gender:</span>
                  <span className="text-sm">{gift.gender}</span>
                </div>
                {gift.recipient && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Recipient:</span>
                    <span className="text-sm">{gift.recipient}</span>
                  </div>
                )}
                {gift.occasion && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Occasion:</span>
                    <span className="text-sm">{gift.occasion}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GiftManager;
