import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Truck,
  MapPin,
  Activity,
  Gauge,
  Battery,
  Fuel,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Users,
  Package,
  TrendingUp,
  RefreshCw,
  Settings,
  Eye,
  Radio,
  Shield,
  Clock,
  ArrowLeft,
  Filter,
  Search,
  Download,
  BarChart3,
  Zap,
  CircleDot
} from 'lucide-react';
import { getDrivers, getAllBookings } from '../../lib/seedData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function AdminFleetManagementPage() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fleet statistics
  const [fleetStats, setFleetStats] = useState({
    totalVehicles: 5,
    activeVehicles: 4,
    inTransit: 1,
    available: 3,
    maintenance: 1,
    totalDistance: 12450,
    avgSpeed: 62,
    fuelEfficiency: 8.5
  });

  // Simulated live vehicle data
  const [vehicleData, setVehicleData] = useState([
    {
      id: 1,
      driver: 'Ramesh Yadav',
      vehicle: 'MH 02 AB 1234',
      status: 'in_transit',
      location: 'NH 48, Pune',
      speed: 65,
      battery: 85,
      fuel: 72,
      booking: 'ASZE2026050001',
      eta: '2h 30m',
      lat: 18.5204,
      lng: 73.8567
    },
    {
      id: 2,
      driver: 'Sunil Kumar',
      vehicle: 'DL 05 CD 5678',
      status: 'available',
      location: 'Delhi Hub',
      speed: 0,
      battery: 100,
      fuel: 95,
      booking: null,
      eta: null,
      lat: 28.7041,
      lng: 77.1025
    },
    {
      id: 3,
      driver: 'Prakash Naik',
      vehicle: 'KA 03 EF 9012',
      status: 'in_transit',
      location: 'Belgaum Bypass',
      speed: 70,
      battery: 78,
      fuel: 45,
      booking: 'ASZE2026050003',
      eta: '4h 15m',
      lat: 15.8497,
      lng: 74.4977
    },
    {
      id: 4,
      driver: 'Manish Das',
      vehicle: 'WB 02 GH 3456',
      status: 'available',
      location: 'Kolkata Hub',
      speed: 0,
      battery: 92,
      fuel: 88,
      booking: null,
      eta: null,
      lat: 22.5726,
      lng: 88.3639
    },
    {
      id: 5,
      driver: 'Ravi Chandra',
      vehicle: 'TS 09 IJ 7890',
      status: 'maintenance',
      location: 'Hyderabad Service Center',
      speed: 0,
      battery: 55,
      fuel: 30,
      booking: null,
      eta: null,
      lat: 17.3850,
      lng: 78.4867
    }
  ]);

  useEffect(() => {
    loadFleetData();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      updateLiveData();
      setLastUpdated(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadFleetData = () => {
    const allDrivers = getDrivers();
    const allBookings = getAllBookings();
    setDrivers(allDrivers);
    setBookings(allBookings);
  };

  const updateLiveData = () => {
    setVehicleData(prev => prev.map(vehicle => {
      if (vehicle.status === 'in_transit') {
        return {
          ...vehicle,
          speed: 60 + Math.random() * 20,
          battery: Math.max(50, vehicle.battery - Math.random() * 0.5),
          fuel: Math.max(20, vehicle.fuel - Math.random() * 0.3),
          lat: vehicle.lat + (Math.random() - 0.5) * 0.01,
          lng: vehicle.lng + (Math.random() - 0.5) * 0.01
        };
      }
      return vehicle;
    }));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      in_transit: 'bg-blue-100 text-blue-800',
      available: 'bg-green-100 text-green-800',
      maintenance: 'bg-orange-100 text-orange-800',
      offline: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      in_transit: Radio,
      available: CheckCircle,
      maintenance: Settings,
      offline: AlertTriangle
    };
    const Icon = icons[status] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  const filteredVehicles = vehicleData.filter(vehicle => {
    const matchesSearch = vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/dashboard')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Truck className="w-7 h-7" />
                  Fleet Management System
                </h1>
                <p className="text-sm text-blue-100 flex items-center gap-2 mt-1">
                  <CircleDot className="w-4 h-4 animate-pulse" />
                  Live tracking • Updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                updateLiveData();
                setLastUpdated(new Date());
              }}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fleet Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Total Vehicles</p>
                    <p className="text-4xl font-bold">{fleetStats.totalVehicles}</p>
                    <p className="text-xs text-blue-200 mt-2">Registered fleet</p>
                  </div>
                  <Truck className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-green-100 mb-1">Active Now</p>
                    <p className="text-4xl font-bold">{fleetStats.activeVehicles}</p>
                    <p className="text-xs text-green-200 mt-2">
                      {Math.round((fleetStats.activeVehicles / fleetStats.totalVehicles) * 100)}% utilization
                    </p>
                  </div>
                  <Activity className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-orange-100 mb-1">In Transit</p>
                    <p className="text-4xl font-bold">{fleetStats.inTransit}</p>
                    <p className="text-xs text-orange-200 mt-2">Active deliveries</p>
                  </div>
                  <Radio className="w-10 h-10 opacity-80 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-purple-100 mb-1">Avg Speed</p>
                    <p className="text-4xl font-bold">{fleetStats.avgSpeed}</p>
                    <p className="text-xs text-purple-200 mt-2">km/h fleet average</p>
                  </div>
                  <Gauge className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by driver or vehicle number..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Grid */}
        <Tabs defaultValue="grid">
          <TabsList className="mb-6">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-xl hover:shadow-2xl transition-shadow border-2 border-blue-100">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                            <Truck className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{vehicle.vehicle}</CardTitle>
                            <CardDescription>{vehicle.driver}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(vehicle.status)}>
                          {getStatusIcon(vehicle.status)}
                          <span className="ml-1">{vehicle.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Location:</span>
                          <span className="text-gray-600">{vehicle.location}</span>
                        </div>

                        {/* Booking */}
                        {vehicle.booking && (
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">Booking:</span>
                            <span className="text-gray-600">{vehicle.booking}</span>
                            {vehicle.eta && (
                              <Badge variant="outline" className="ml-auto">
                                ETA: {vehicle.eta}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Live Stats */}
                        <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Gauge className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-lg font-bold text-gray-900">{vehicle.speed}</p>
                            <p className="text-xs text-gray-500">km/h</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Battery className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-lg font-bold text-gray-900">{vehicle.battery}%</p>
                            <p className="text-xs text-gray-500">Battery</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Fuel className="w-4 h-4 text-orange-600" />
                            </div>
                            <p className="text-lg font-bold text-gray-900">{vehicle.fuel}%</p>
                            <p className="text-xs text-gray-500">Fuel</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-3 border-t">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/live-tracking?booking=${vehicle.booking}`)}
                            disabled={!vehicle.booking}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Track
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Settings className="w-4 h-4 mr-2" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map">
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="h-[600px] bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-20 h-20 text-blue-600 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Fleet Map View</h3>
                    <p className="text-gray-600 mb-4">
                      All {fleetStats.totalVehicles} vehicles displayed on interactive map with real-time locations
                    </p>
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
                      <p className="text-sm font-semibold text-gray-900 mb-3">Active Vehicles:</p>
                      <div className="space-y-2">
                        {vehicleData.filter(v => v.status === 'in_transit').map((vehicle) => (
                          <div key={vehicle.id} className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2">
                              <CircleDot className="w-3 h-3 text-blue-600 animate-pulse" />
                              {vehicle.vehicle}
                            </span>
                            <span className="text-gray-600">{vehicle.location}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Fleet Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Total Distance Covered</p>
                        <p className="text-2xl font-bold text-gray-900">{fleetStats.totalDistance} km</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Fuel Efficiency</p>
                        <p className="text-2xl font-bold text-gray-900">{fleetStats.fuelEfficiency} km/L</p>
                      </div>
                      <Fuel className="w-8 h-8 text-blue-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Available Vehicles</p>
                        <p className="text-2xl font-bold text-gray-900">{fleetStats.available}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Security & Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900">All Systems Operational</p>
                        <p className="text-sm text-green-700">GPS tracking active on all vehicles</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-orange-900">1 Vehicle in Maintenance</p>
                        <p className="text-sm text-orange-700">TS 09 IJ 7890 - Scheduled service</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900">Geo-Fencing Active</p>
                        <p className="text-sm text-blue-700">All vehicles within authorized zones</p>
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
