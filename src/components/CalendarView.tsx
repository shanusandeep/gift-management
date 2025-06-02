
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'birthday' | 'anniversary' | 'holiday';
  recipient?: string;
}

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Mock events data
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: "Sarah's Birthday",
      date: new Date(2024, 5, 15), // June 15
      type: 'birthday',
      recipient: 'Sarah Johnson'
    },
    {
      id: '2',
      title: "Wedding Anniversary",
      date: new Date(2024, 5, 22), // June 22
      type: 'anniversary',
      recipient: 'Mom & Dad'
    },
    {
      id: '3',
      title: "Tom's Birthday",
      date: new Date(2024, 6, 1), // July 1
      type: 'birthday',
      recipient: 'Tom Wilson'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getEventsForDate = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => 
      event.date.getDate() === day &&
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    const upcoming = events.filter(event => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
    return upcoming;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'birthday': return 'bg-blue-100 text-blue-800';
      case 'anniversary': return 'bg-purple-100 text-purple-800';
      case 'holiday': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventEmoji = (type: string) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'anniversary': return '💕';
      case 'holiday': return '🎉';
      default: return '📅';
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      
      days.push(
        <div
          key={day}
          className={`p-2 min-h-[80px] border rounded-lg relative ${
            isToday ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
          }`}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event, index) => (
              <div
                key={index}
                className={`text-xs px-1 py-0.5 rounded ${getEventTypeColor(event.type)} truncate`}
                title={event.title}
              >
                {getEventEmoji(event.type)} {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Calendar & Events</h2>
        <p className="text-gray-600">Track important dates and upcoming occasions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {getMonthName(currentDate)}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Don't miss these important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => {
                    const daysUntil = Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge variant={daysUntil <= 7 ? 'destructive' : 'default'}>
                            {daysUntil === 0 ? 'Today' : `${daysUntil} days`}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {event.date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        {event.recipient && (
                          <p className="text-sm text-gray-500">For {event.recipient}</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 italic">No upcoming events</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                  <span className="text-sm">🎂 Birthdays</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
                  <span className="text-sm">💕 Anniversaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span className="text-sm">🎉 Holidays</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
