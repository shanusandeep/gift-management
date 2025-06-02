
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Users, Calendar, DollarSign } from "lucide-react";

const Dashboard = () => {
  // Mock data for demo
  const stats = {
    totalGifts: 24,
    totalRecipients: 8,
    upcomingEvents: 3,
    totalSpent: 450
  };

  const upcomingEvents = [
    { name: "Sarah's Birthday", date: "June 15", type: "birthday" },
    { name: "Wedding Anniversary", date: "June 22", type: "anniversary" },
    { name: "Tom's Graduation", date: "July 1", type: "graduation" }
  ];

  const recentGifts = [
    { name: "Wireless Headphones", recipient: "Sarah", status: "purchased", price: 89 },
    { name: "Coffee Maker", recipient: "Mom", status: "wrapped", price: 120 },
    { name: "Board Game", recipient: "Tom", status: "delivered", price: 35 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gifts</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGifts}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecipients}</div>
            <p className="text-xs text-muted-foreground">Active recipients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Don't miss these important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <Badge variant={event.type === 'birthday' ? 'default' : 'secondary'}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Gifts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Gifts</CardTitle>
            <CardDescription>Latest gift activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGifts.map((gift, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium">{gift.name}</p>
                    <p className="text-sm text-gray-600">For {gift.recipient}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={gift.status === 'delivered' ? 'default' : 'outline'}>
                      {gift.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">${gift.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
