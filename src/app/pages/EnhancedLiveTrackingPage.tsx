import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
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
  Gauge,
  Zap,
  AlertTriangle,
  MessageSquare,
  Bell,
  Shield,
  TrendingUp,
  MapPinned,
  Radio,
  Fuel,
  Activity,
  CircleDot,
  Info,
  Calendar,
  Timer,
  Route
} from 'lucide-react';
import { getAllBookings } from '../../lib/seedData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';

export default function EnhancedLiveTrackingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingNumber = searchParams.get('booking');

  const [booking, setBooking] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'details' | 'history' | 'alerts'>('map');

  // Live tracking data
  const [liveLocation, setLiveLocation] = useState({
    lat: 19.0760,
    lng: 72.8777,
    speed: 0,
    heading: 0,
    battery: 85,
    fuel: 75,
    isMoving: true,
    altitude: 15,
    accuracy: 10
  });

  const [driverStatus, setDriverStatus] = useState({
    name: 'Prakash Naik',
    phone: '+91 9890123456',
    vehicle: 'KA 03 EF 9012',
    rating: 4.9,
    photo: 'https://i.pravatar.cc/150?img=52',
    status: 'On Route',
    experience: '5 years'
  });

  const [shipmentStatus, setShipmentStatus] = useState({
    currentStatus: 'In Transit',
    progress: 65,
    estimatedArrival: '2026-05-17 14:30',
    distanceRemaining: 345,
    timeRemaining: '4h 30m',
    lastCheckpoint: 'Pune Checkpoint',
    nextCheckpoint: 'Belgaum Checkpoint',
    delayStatus: 'On Time'
  });

  const [trafficAlerts, setTrafficAlerts] = useState([
    { id: 1, type: 'heavy', location: 'NH 48 near Kolhapur', severity: 'medium', eta: '+15 min' },
    { id: 2, type: 'construction', location: 'Belgaum Bypass', severity: 'low', eta: '+5 min' }
  ]);

  const [routeHistory, setRouteHistory] = useState([
    { id: 1, location: 'Mumbai - Pickup Point', time: '2026-05-15 09:00 AM', status: 'completed', icon: CheckCircle },
    { id: 2, location: 'Pune Checkpoint', time: '2026-05-15 02:30 PM', status: 'completed', icon: CheckCircle },
    { id: 3, location: 'Satara Rest Stop', time: '2026-05-15 06:45 PM', status: 'completed', icon: CheckCircle },
    { id: 4, location: 'Kolhapur Border', time: '2026-05-16 09:15 AM', status: 'completed', icon: CheckCircle },
    { id: 5, location: 'En Route to Belgaum', time: 'Current Location', status: 'current', icon: Radio },
    { id: 6, location: 'Belgaum Checkpoint', time: 'Expected: 3:00 PM', status: 'upcoming', icon: MapPin },
    { id: 7, location: 'Bangalore - Delivery', time: 'Expected: May 17, 2:30 PM', status: 'upcoming', icon: Package }
  ]);

  const [geoFencing, setGeoFencing] = useState({
    enabled: true,
    route: 'NH 48 - Mumbai to Bangalore',
    deviationAlert: false,
    safeZone: 'Within authorized route'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (bookingNumber) {
      loadBookingData();
      startLiveTracking();
    }
  }, [bookingNumber]);

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      updateLiveData();
      setLastUpdated(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadBookingData = () => {
    const allBookings = getAllBookings();
    const foundBooking = allBookings.find((b: any) => b.booking_number === bookingNumber);

    if (foundBooking) {
      setBooking(foundBooking);
    }
    setIsLoading(false);
  };

  const startLiveTracking = () => {
    // Simulate initial GPS lock
    setTimeout(() => {
      toast.success('GPS tracking active - Live updates enabled');
    }, 1000);
  };

  const updateLiveData = () => {
    // Simulate realistic live updates
    setLiveLocation(prev => ({
      ...prev,
      lat: prev.lat + (Math.random() - 0.5) * 0.002,
      lng: prev.lng + (Math.random() - 0.5) * 0.002,
      speed: 60 + Math.random() * 15,
      battery: Math.max(50, prev.battery - Math.random() * 0.1),
      fuel: Math.max(20, prev.fuel - Math.random() * 0.05),
      accuracy: 5 + Math.random() * 5
    }));

    setShipmentStatus(prev => ({
      ...prev,
      progress: Math.min(100, prev.progress + Math.random() * 0.5),
      distanceRemaining: Math.max(0, prev.distanceRemaining - Math.random() * 2)
    }));
  };

  const handleSOSEmergency = () => {
    toast.error('SOS Alert Sent! Emergency services notified.');
    // In production, this would trigger actual emergency protocols
  };

  const handleRefresh = () => {
    updateLiveData();
    setLastUpdated(new Date());
    toast.success('Tracking data refreshed');
  };

  const calculateProgress = () => {
    if (!booking) return 0;
    return shipmentStatus.progress;
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

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Initializing GPS Tracking...</p>
          <p className="text-sm text-gray-500 mt-2">Establishing satellite connection</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Booking Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We couldn't find tracking information for booking: {bookingNumber}
            </p>
            <Button onClick={() => navigate('/tracking')} className="w-full">
              Go to Tracking Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/tracking')} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Radio className="w-6 h-6 animate-pulse" />
                  Live GPS Tracking
                </h1>
                <p className="text-sm text-blue-100 flex items-center gap-2 mt-1">
                  <CircleDot className="w-4 h-4 animate-pulse" />
                  Tracking ID: {booking.booking_number}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Updated: {lastUpdated.toLocaleTimeString()}
              </Badge>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="destructive"
                onClick={handleSOSEmergency}
                className="bg-red-600 hover:bg-red-700 animate-pulse"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                SOS
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Progress Bar */}
        <Card className="mb-6 shadow-xl border-2 border-blue-200">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-gray-900">Shipment Progress</span>
                  <Badge className={getStatusColor(booking.status)}>
                    {shipmentStatus.currentStatus}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{Math.round(calculateProgress())}%</p>
                  <p className="text-xs text-gray-500">Complete</p>
                </div>
              </div>
              <Progress value={calculateProgress()} className="h-3" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Timer className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-gray-600">ETA</p>
                </div>
                <p className="font-bold text-gray-900">{shipmentStatus.estimatedArrival}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-gray-600">Distance Left</p>
                </div>
                <p className="font-bold text-gray-900">{shipmentStatus.distanceRemaining} km</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <p className="text-xs text-gray-600">Time Left</p>
                </div>
                <p className="font-bold text-gray-900">{shipmentStatus.timeRemaining}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-orange-600" />
                  <p className="text-xs text-gray-600">Status</p>
                </div>
                <p className="font-bold text-green-600">{shipmentStatus.delayStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="mb-6 bg-white shadow-lg p-1 rounded-xl">
            <TabsTrigger value="map" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <MapPin className="w-4 h-4 mr-2" />
              Live Map
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <Info className="w-4 h-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <Route className="w-4 h-4 mr-2" />
              Route History
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* LIVE MAP TAB */}
          <TabsContent value="map">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map Section */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden shadow-xl">
                  <div className="h-[500px] bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8 max-w-md">
                        <MapPin className="w-20 h-20 text-blue-600 mx-auto mb-4 animate-bounce" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Interactive GPS Map</h3>
                        <p className="text-gray-600 mb-4">
                          Replace 'YOUR_GOOGLE_MAPS_API_KEY' in the code with your actual Google Maps API key to enable live tracking
                        </p>
                        <div className="bg-white p-4 rounded-xl shadow-lg text-left">
                          <p className="text-sm font-semibold text-gray-900 mb-2">Current Vehicle Location:</p>
                          <div className="space-y-1 text-xs text-gray-600">
                            <p>📍 Latitude: {liveLocation.lat.toFixed(6)}</p>
                            <p>📍 Longitude: {liveLocation.lng.toFixed(6)}</p>
                            <p>⚡ Speed: {liveLocation.speed.toFixed(1)} km/h</p>
                            <p>🧭 Heading: {liveLocation.heading}°</p>
                            <p>📶 Accuracy: ±{liveLocation.accuracy.toFixed(1)} meters</p>
                            <p>🛰️ Altitude: {liveLocation.altitude} meters</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Map overlay controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button
                        size="sm"
                        className="bg-white text-gray-700 hover:bg-gray-100 shadow-lg"
                      >
                        <Navigation className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-white text-gray-700 hover:bg-gray-100 shadow-lg"
                      >
                        <Zap className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Live Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className="w-5 h-5" />
                        <p className="text-xs opacity-90">Current Speed</p>
                      </div>
                      <p className="text-2xl font-bold">{liveLocation.speed.toFixed(0)} km/h</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Battery className="w-5 h-5" />
                        <p className="text-xs opacity-90">Battery</p>
                      </div>
                      <p className="text-2xl font-bold">{liveLocation.battery.toFixed(0)}%</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Fuel className="w-5 h-5" />
                        <p className="text-xs opacity-90">Fuel Level</p>
                      </div>
                      <p className="text-2xl font-bold">{liveLocation.fuel.toFixed(0)}%</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Navigation className="w-5 h-5" />
                        <p className="text-xs opacity-90">GPS Accuracy</p>
                      </div>
                      <p className="text-2xl font-bold">±{liveLocation.accuracy.toFixed(0)}m</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Driver Info */}
                <Card className="shadow-xl border-2 border-blue-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Driver Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={driverStatus.photo}
                        alt={driverStatus.name}
                        className="w-16 h-16 rounded-full border-4 border-blue-200"
                      />
                      <div>
                        <p className="font-bold text-lg">{driverStatus.name}</p>
                        <p className="text-sm text-gray-600">{driverStatus.vehicle}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                i < Math.floor(driverStatus.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="text-xs text-gray-600 ml-1">
                            {driverStatus.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{driverStatus.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Activity className="w-4 h-4" />
                        <span>Status: {driverStatus.status}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Experience: {driverStatus.experience}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t space-y-2">
                      <Button className="w-full" variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Driver
                      </Button>
                      <Button className="w-full" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Geo-Fencing Security */}
                <Card className="shadow-xl border-2 border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Geo-Fencing Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Protected
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600 mb-1">Authorized Route:</p>
                        <p className="font-semibold">{geoFencing.route}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600 mb-1">Zone Status:</p>
                        <p className="font-semibold text-green-600">{geoFencing.safeZone}</p>
                      </div>
                      {geoFencing.deviationAlert && (
                        <Alert className="bg-red-50 border-red-200">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            Route deviation detected!
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Checkpoints */}
                <Card className="shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2">
                      <MapPinned className="w-5 h-5 text-purple-600" />
                      Checkpoints
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-900">Last Checkpoint</span>
                        </div>
                        <p className="text-sm text-gray-700">{shipmentStatus.lastCheckpoint}</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                          <span className="text-sm font-semibold text-blue-900">Next Checkpoint</span>
                        </div>
                        <p className="text-sm text-gray-700">{shipmentStatus.nextCheckpoint}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* DETAILS TAB */}
          <TabsContent value="details">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipment Details */}
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle>Shipment Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking Number</p>
                    <p className="font-bold text-lg">{booking.booking_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service Type</p>
                    <p className="font-semibold">{booking.service_type}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-semibold">{booking.distance_km} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-semibold">{booking.weight_kg} kg</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Items Description</p>
                    <p className="font-semibold">{booking.items_description}</p>
                  </div>
                  {booking.special_instructions && (
                    <div>
                      <p className="text-sm text-gray-500">Special Instructions</p>
                      <p className="font-semibold">{booking.special_instructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Route Information */}
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle>Route Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="font-semibold">{booking.pickup_address}</p>
                      <p className="text-sm text-gray-600">{booking.pickup_city}, {booking.pickup_state}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {booking.pickup_date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery Location</p>
                      <p className="font-semibold">{booking.delivery_address}</p>
                      <p className="text-sm text-gray-600">{booking.delivery_city}, {booking.delivery_state}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Expected: {booking.estimated_delivery || 'TBD'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Route Optimization</p>
                    <p className="text-xs text-blue-700">
                      Fastest route calculated via NH 48 with minimal traffic delays
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ROUTE HISTORY TAB */}
          <TabsContent value="history">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-purple-600" />
                  Route History & Timeline
                </CardTitle>
                <CardDescription>Complete journey tracking with timestamps</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {routeHistory.map((checkpoint, index) => (
                    <motion.div
                      key={checkpoint.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            checkpoint.status === 'completed'
                              ? 'bg-green-100 text-green-600'
                              : checkpoint.status === 'current'
                              ? 'bg-blue-100 text-blue-600 animate-pulse'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <checkpoint.icon className="w-6 h-6" />
                        </div>
                        {index < routeHistory.length - 1 && (
                          <div
                            className={`w-1 h-12 ${
                              checkpoint.status === 'completed'
                                ? 'bg-green-300'
                                : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{checkpoint.location}</h4>
                            <p className="text-sm text-gray-600">{checkpoint.time}</p>
                          </div>
                          <Badge
                            className={
                              checkpoint.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : checkpoint.status === 'current'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {checkpoint.status}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ALERTS TAB */}
          <TabsContent value="alerts">
            <div className="space-y-6">
              {/* Traffic Alerts */}
              <Card className="shadow-xl border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Traffic & Route Alerts
                  </CardTitle>
                  <CardDescription>Real-time traffic conditions and delays</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {trafficAlerts.map((alert) => (
                      <Alert
                        key={alert.id}
                        className={`border-2 ${getSeverityColor(alert.severity)}`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{alert.type.toUpperCase()}</p>
                              <p className="text-sm">{alert.location}</p>
                            </div>
                            <Badge className="bg-white">
                              ETA Impact: {alert.eta}
                            </Badge>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Notifications */}
              <Card className="shadow-xl border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Push Notifications
                  </CardTitle>
                  <CardDescription>Recent system updates and alerts</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900">GPS Lock Acquired</p>
                        <p className="text-sm text-green-700">Live tracking active with 10m accuracy</p>
                        <p className="text-xs text-green-600 mt-1">2 minutes ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900">Checkpoint Reached</p>
                        <p className="text-sm text-blue-700">Vehicle reached Kolhapur Border</p>
                        <p className="text-xs text-blue-600 mt-1">1 hour ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-purple-900">Route Optimized</p>
                        <p className="text-sm text-purple-700">Alternate route suggested to avoid traffic</p>
                        <p className="text-xs text-purple-600 mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
