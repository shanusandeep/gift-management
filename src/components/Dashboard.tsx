
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Users, Calendar, DollarSign, TrendingUp, Clock, Star, Heart, Loader2 } from "lucide-react";
import { useGifts } from '@/hooks/useGifts';
import { useRecipients } from '@/hooks/useRecipients';
import { useEvents } from '@/hooks/useEvents';

const Dashboard = () => {
  const { gifts, loading: giftsLoading } = useGifts();
  const { recipients, loading: recipientsLoading } = useRecipients();
  const { events, loading: eventsLoading } = useEvents();

  if (giftsLoading || recipientsLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-emerald-600">Loading dashboard...</span>
      </div>
    );
  }

  // Calculate statistics
  const totalSpent = gifts.reduce((sum, gift) => sum + (gift.price || 0), 0);
  const recentGifts = gifts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // Get upcoming events
  const upcomingEvents = () => {
    const today = new Date();
    const eventsList = [];

    recipients.forEach(recipient => {
      if (recipient.birthday) {
        const birthday = new Date(recipient.birthday);
        const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
        if (thisYearBirthday < today) {
          thisYearBirthday.setFullYear(today.getFullYear() + 1);
        }
        const daysUntil = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        eventsList.push({
          name: `${recipient.name}'s Birthday`,
          date: thisYearBirthday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          type: 'birthday',
          daysLeft: daysUntil
        });
      }

      if (recipient.anniversary) {
        const anniversary = new Date(recipient.anniversary);
        const thisYearAnniversary = new Date(today.getFullYear(), anniversary.getMonth(), anniversary.getDate());
        if (thisYearAnniversary < today) {
          thisYearAnniversary.setFullYear(today.getFullYear() + 1);
        }
        const daysUntil = Math.ceil((thisYearAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        eventsList.push({
          name: `${recipient.name}'s Anniversary`,
          date: thisYearAnniversary.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          type: 'anniversary',
          daysLeft: daysUntil
        });
      }
    });

    // Add events from events table
    events.forEach(event => {
      const eventDate = new Date(event.event_date);
      const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil >= 0) {
        eventsList.push({
          name: event.title,
          date: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          type: event.event_type,
          daysLeft: daysUntil
        });
      }
    });

    return eventsList
      .filter(event => event.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);
  };

  const upcomingEventsList = upcomingEvents();

  const getRecipientName = (recipientId) => {
    const recipient = recipients.find(r => r.id === recipientId);
    return recipient ? recipient.name : 'Unknown';
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Gifts</CardTitle>
            <Gift className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{gifts.length}</div>
            <p className="text-xs opacity-80 mt-1">In your collection</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Recipients</CardTitle>
            <Users className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recipients.length}</div>
            <p className="text-xs opacity-80 mt-1">Active recipients</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Upcoming Events</CardTitle>
            <Calendar className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingEventsList.length}</div>
            <p className="text-xs opacity-80 mt-1">Next 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Spent</CardTitle>
            <DollarSign className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs opacity-80 mt-1">On gifts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription className="text-pink-100">
              Don't miss important dates
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {upcomingEventsList.length > 0 ? (
                upcomingEventsList.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{event.name}</h4>
                        <p className="text-sm text-gray-600">{event.date}</p>
                      </div>
                    </div>
                    <Badge variant={event.daysLeft <= 5 ? "destructive" : "default"} className="font-medium">
                      {event.daysLeft} days
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No upcoming events</p>
                  <p className="text-sm text-gray-400">Add recipients with birthdays or anniversaries</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Gifts */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Gifts
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Latest gift activities
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentGifts.length > 0 ? (
                recentGifts.map((gift) => (
                  <div key={gift.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                        <Gift className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{gift.name}</h4>
                        <p className="text-sm text-gray-600">For {getRecipientName(gift.recipient_id)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {gift.price && <p className="font-semibold text-gray-800">${gift.price}</p>}
                      <Badge variant="outline" className="text-xs mt-1">
                        {gift.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No gifts yet</p>
                  <p className="text-sm text-gray-400">Start by adding your first gift</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview - Simplified since we don't have budget data */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Spending Overview
          </CardTitle>
          <CardDescription className="text-emerald-100">
            Track your gift spending
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <p className="text-2xl font-bold text-gray-800">${totalSpent.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <p className="text-2xl font-bold text-gray-800">
                  ${gifts.length > 0 ? (totalSpent / gifts.length).toFixed(2) : '0.00'}
                </p>
                <p className="text-sm text-gray-600">Average per Gift</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <p className="text-2xl font-bold text-gray-800">
                  {gifts.filter(gift => gift.status === 'delivered').length}
                </p>
                <p className="text-sm text-gray-600">Gifts Delivered</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
