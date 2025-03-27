import React from 'react';
import { 
  Car, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Activity, 
  DollarSign, 
  Calendar 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart, 
  Bar 
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

const revenueData = [
  { name: 'Jan', revenue: 4000, bookings: 2400 },
  { name: 'Feb', revenue: 3000, bookings: 1398 },
  { name: 'Mar', revenue: 2000, bookings: 9800 },
  { name: 'Apr', revenue: 2780, bookings: 3908 },
  { name: 'May', revenue: 1890, bookings: 4800 },
  { name: 'Jun', revenue: 2390, bookings: 3800 },
];

const vehicleData = [
  { name: 'Available', value: 65, fill: '#8884d8' },
  { name: 'Rented', value: 35, fill: '#82ca9d' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Vehicle Management',
      icon: <Car className="h-6 w-6" />,
      count: '50 Vehicles',
      route: '/dashboard/vehicle',
      variant: 'default'
    },
    {
      title: 'Customer Management',
      icon: <Users className="h-6 w-6" />,
      count: '1,234 Customers',
      route: '/dashboard/users',
      variant: 'secondary'
    },
    {
      title: 'Bookings',
      icon: <Calendar className="h-6 w-6" />,
      count: '342 Active',
      route: '/dashboard/booking',
      variant: 'outline'
    },
    {
      title: 'Testimonials',
      icon: <MessageSquare className="h-6 w-6" />,
      count: '28 Reviews',
      route: '/dashboard/testimonial',
      variant: 'destructive'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.count}</div>
              <Button 
                variant="link" 
                className="p-0 mt-2"
                onClick={() => navigate(card.route)}
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Statistics */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-green-500">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-green-500">Active Users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Booking Confirmations</span>
                <Badge variant="destructive">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Vehicle Maintenance</span>
                <Badge variant="outline">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;