import React from 'react';
import { Car, Users, Calendar, MessageSquare, Activity, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useGetDashboardInfoQuery } from '@/slices/adminApiSlice';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong in the dashboard.</div>;
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetDashboardInfoQuery();
  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard data</div>;

  const {
    totalUsers = 0,
    totalVehicles = 0,
    totalBookings = 0,
    totalTestimonials = 0,
    availableVehicles = 0,
    unavailableVehicles = 0,
    monthlyRevenue = []
  } = data || {};

  const revenueData = Array.isArray(monthlyRevenue)
    ? monthlyRevenue.map(item => ({ name: item.month, revenue: item.revenue })).reverse()
    : [];

  const vehicleData = [
    { name: 'Available', value: availableVehicles },
    { name: 'Unavailable', value: unavailableVehicles }
  ];

  const dashboardCards = [
    {
      title: 'Vehicle Management',
      icon: <Car className="h-6 w-6" />,
      count: `${totalVehicles} Vehicles`,
      route: '/dashboard/vehicle'
    },
    {
      title: 'Customer Management',
      icon: <Users className="h-6 w-6" />,
      count: `${totalUsers} Customers`,
      route: '/dashboard/users'
    },
    {
      title: 'Bookings',
      icon: <Calendar className="h-6 w-6" />,
      count: `${totalBookings} Total`,
      route: '/dashboard/booking'
    },
    {
      title: 'Testimonials',
      icon: <MessageSquare className="h-6 w-6" />,
      count: `${totalTestimonials} Total`,
      route: '/dashboard/testimonial'
    }
  ];

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {dashboardCards.map((card, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
                <Button variant="link" className="p-0 mt-2" onClick={() => navigate(card.route)}>
                  Manage
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
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
                  <Line type="monotone" dataKey="revenue" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

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
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Activity className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Vehicles</CardTitle>
              <Car className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableVehicles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unavailable Vehicles</CardTitle>
              <Car className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unavailableVehicles}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;