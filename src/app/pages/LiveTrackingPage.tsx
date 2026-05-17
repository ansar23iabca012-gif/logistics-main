import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import {
  MapPin,
  Navigation,
  Truck,
  Package,
  Clock,
  Phone,
  User,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  Battery,
  Gauge
} from 'lucide-react';
import { APIProvider, Map, Marker, AdvancedMarker } from '@vis.gl/react-google-maps';
import { getAllBookings } from '../../lib/seedData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export default function LiveTrackingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingNumber = searchParams.get('booking');

  const [booking, setBooking] = useState<any>(null);
  const [liveLocation, setLiveLocation] = useState({
    lat: 19.0760,
    lng: 72.8777,
    speed: 0,
    heading: 0,
    battery: 85
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Pickup and delivery locations
  const [locations] = useState({
    pickup: { lat: 19.0760, lng: 72.8777 }, // Mumbai
    delivery: { lat: 12.9716, lng: 77.5946 } // Bangalore
  });

  useEffect(() => {
    if (bookingNumber) {
      loadBookingData();
      startLiveTracking();
    }
  }, [bookingNumber]);

  const loadBookingData = () => {
    const allBookings = getAllBookings();
    const foundBooking = allBookings.find((b: any) => b.booking_number === bookingNumber);

    if (foundBooking) {
      setBooking(foundBooking);

      // Set locations based on cities
      const cityCoordinates: Record<string, { lat: number; lng: number }> = {
        Mumbai: { lat: 19.0760, lng: 72.8777 },
        Delhi: { lat: 28.7041, lng: 77.1025 },
        Bangalore: { lat: 12.9716, lng: 77.5946 },
        Kolkata: { lat: 22.5726, lng: 88.3639 },
        Hyderabad: { lat: 17.3850, lng: 78.4867 },
        Chennai: { lat: 13.0827, lng: 80.2707 }
      };

      // Simulate live tracking between pickup and delivery
      if (foundBooking.status === 'in_transit') {
        const pickup = cityCoordinates[foundBooking.pickup_city] || locations.pickup;
        const delivery = cityCoordinates[foundBooking.delivery_city] || locations.delivery;

        // Simulate vehicle at 40% of journey
        const progress = 0.4;
        setLiveLocation({
          lat: pickup.lat + (delivery.lat - pickup.lat) * progress,
          lng: pickup.lng + (delivery.lng - pickup.lng) * progress,
          speed: 65 + Math.random() * 10,
          heading: 180,
          battery: 85 - Math.floor(Math.random() * 10)
        });
      }
    }

    setIsLoading(false);
  };

  const startLiveTracking = () => {
    // Simulate live updates every 5 seconds
    const interval = setInterval(() => {
      setLiveLocation(prev => ({
        ...prev,
        speed: 60 + Math.random() * 15,
        battery: Math.max(50, prev.battery - Math.random() * 0.5),
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  };

  const refreshTracking = () => {
    loadBookingData();
    setLastUpdated(new Date());
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateProgress = () => {
    if (!booking) return 0;
    const statusProgress: Record<string, number> = {
      pending: 10,
      confirmed: 25,
      assigned: 40,
      in_transit: 70,
      delivered: 100
    };
    return statusProgress[booking.status] || 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Booking Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We couldn't find a booking with number: {bookingNumber}
            </p>
            <Button onClick={() => navigate('/tracking')}>
              Go to Tracking Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Demo API key - replace with your actual Google Maps API key
  const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/tracking')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Live Tracking</h1>
                <p className="text-sm text-gray-500">{booking.booking_number}</p>
              </div>
            </div>
            <Button variant="outline" onClick={refreshTracking}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Progress */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Delivery Progress</span>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Progress value={calculateProgress()} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <CheckCircle className={`w-6 h-6 mx-auto mb-1 ${calculateProgress() >= 25 ? 'text-green-600' : 'text-gray-300'}`} />
                    <p className="text-xs text-gray-600">Confirmed</p>
                  </div>
                  <div>
                    <Truck className={`w-6 h-6 mx-auto mb-1 ${calculateProgress() >= 70 ? 'text-orange-600' : 'text-gray-300'}`} />
                    <p className="text-xs text-gray-600">In Transit</p>
                  </div>
                  <div>
                    <Package className={`w-6 h-6 mx-auto mb-1 ${calculateProgress() === 100 ? 'text-green-600' : 'text-gray-300'}`} />
                    <p className="text-xs text-gray-600">Delivered</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Maps */}
            <Card className="overflow-hidden">
              <div className="h-96 lg:h-[500px] bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Live GPS Tracking</h3>
                    <p className="text-gray-600 mb-4">
                      Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual Google Maps API key in the code
                    </p>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-left max-w-md">
                      <p className="text-sm font-medium text-gray-900 mb-2">Current Location:</p>
                      <p className="text-xs text-gray-600">Lat: {liveLocation.lat.toFixed(4)}</p>
                      <p className="text-xs text-gray-600">Lng: {liveLocation.lng.toFixed(4)}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Gauge className="w-4 h-4 text-blue-600" />
                          <span className="text-xs">{liveLocation.speed.toFixed(0)} km/h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Battery className="w-4 h-4 text-green-600" />
                          <span className="text-xs">{liveLocation.battery.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Speed</p>
                      <p className="text-lg font-bold">{liveLocation.speed.toFixed(0)} km/h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Battery className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Battery</p>
                      <p className="text-lg font-bold">{liveLocation.battery.toFixed(0)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Heading</p>
                      <p className="text-lg font-bold">{liveLocation.heading}°</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-500">Updated</p>
                      <p className="text-lg font-bold">{lastUpdated.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Details Sidebar */}
          <div className="space-y-6">
            {/* Booking Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Service Type</p>
                  <p className="font-medium">{booking.service_type}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Distance</p>
                  <p className="font-medium">{booking.distance_km} km</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="font-medium">{booking.weight_kg} kg</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Vehicle</p>
                  <p className="font-medium">{booking.vehicle_number || 'Not assigned'}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Estimated Delivery</p>
                  <p className="font-medium">{booking.estimated_delivery || 'TBD'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Route Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Route Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Pickup Location</p>
                    <p className="font-medium text-sm">{booking.pickup_address}</p>
                    <p className="text-sm text-gray-600">{booking.pickup_city}, {booking.pickup_state}</p>
                    <p className="text-xs text-gray-500">{booking.pickup_date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Delivery Location</p>
                    <p className="font-medium text-sm">{booking.delivery_address}</p>
                    <p className="text-sm text-gray-600">{booking.delivery_city}, {booking.delivery_state}</p>
                    <p className="text-xs text-gray-500">{booking.estimated_delivery || 'TBD'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Contact */}
            {booking.driver_id && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Driver Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Driver Name</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Driver
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support: 1800 170 6200
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
