
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Gift, Edit, Trash2, Upload, DollarSign, Tag, User, Calendar } from "lucide-react";

const GiftManager = () => {
  const [gifts, setGifts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      recipient: "Alice",
      occasion: "Birthday",
      ageGroup: "Adult",
      gender: "Unisex",
      price: 150,
      status: "Delivered",
      dateGiven: "2024-01-15",
      source: "Bought",
      image: null
    },
    {
      id: 2,
      name: "Board Game",
      category: "Toys",
      recipient: "Tommy",
      occasion: "Christmas",
      ageGroup: "Child",
      gender: "Unisex",
      price: 35,
      status: "Wrapped",
      dateGiven: "",
      source: "Bought",
      image: null
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-500';
      case 'wrapped': return 'bg-blue-500';
      case 'purchased': return 'bg-yellow-500';
      case 'available': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gift Collection
          </h2>
          <p className="text-gray-600 mt-2">Manage and organize all your gifts</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Gift
        </Button>
      </div>

      {/* Add Gift Form */}
      {showAddForm && (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Add New Gift
            </CardTitle>
            <CardDescription className="text-purple-100">
              Fill in the details for your new gift
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="giftName" className="text-sm font-semibold text-gray-700">Gift Name</Label>
                <Input id="giftName" placeholder="Enter gift name" className="border-2 border-gray-200 focus:border-purple-400 rounded-lg" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category</Label>
                <Input id="category" placeholder="e.g., Electronics, Toys" className="border-2 border-gray-200 focus:border-purple-400 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-sm font-semibold text-gray-700">Recipient</Label>
                <Input id="recipient" placeholder="Who is this for?" className="border-2 border-gray-200 focus:border-purple-400 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occasion" className="text-sm font-semibold text-gray-700">Occasion</Label>
                <Input id="occasion" placeholder="e.g., Birthday, Christmas" className="border-2 border-gray-200 focus:border-purple-400 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ageGroup" className="text-sm font-semibold text-gray-700">Age Group</Label>
                <Input id="ageGroup" placeholder="Child, Teenager, Adult, Senior" className="border-2 border-gray-200 focus:border-purple-400 rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold text-gray-700">Price</Label>
                <Input id="price" type="number" placeholder="0.00" className="border-2 border-gray-200 focus:border-purple-400 rounded-lg" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-semibold text-gray-700">Upload Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex-1">
                Save Gift
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifts.map((gift) => (
          <Card key={gift.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Gift className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-800">{gift.name}</CardTitle>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100">
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="h-3 w-3" />
                  <span>{gift.category}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-3 w-3" />
                  <span>{gift.recipient}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>{gift.occasion}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="h-3 w-3" />
                  <span>${gift.price}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs bg-gray-100">
                  {gift.ageGroup}
                </Badge>
                <Badge variant="outline" className="text-xs bg-gray-100">
                  {gift.gender}
                </Badge>
                <Badge className={`text-white text-xs ${getStatusColor(gift.status)}`}>
                  {gift.status}
                </Badge>
              </div>

              {gift.dateGiven && (
                <p className="text-xs text-gray-500 border-t pt-3">
                  Given on: {new Date(gift.dateGiven).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GiftManager;
