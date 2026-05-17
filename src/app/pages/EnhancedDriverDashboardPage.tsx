import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Truck,
  CheckCircle,
  XCircle,
  Package,
  MapPin,
  Phone,
  Camera,
  FileText,
  Clock,
  DollarSign,
  Navigation,
  Activity,
  AlertCircle,
  Upload,
  Send,
  LogOut,
  Bell,
  Star,
  TrendingUp,
  Shield,
  User,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { getCurrentUser, logout } from '../../lib/auth';
import { getAllBookings } from '../../lib/seedData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

// Delivery stages that driver can update
const DELIVERY_STAGES = [
  { value: 'picked_up', label: 'Picked Up', color: 'bg-blue-100 text-blue-800', icon: Package },
  { value: 'in_transit', label: 'In Transit', color: 'bg-orange-100 text-orange-800', icon: Truck },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800', icon: Navigation },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle }
];

export default function EnhancedDriverDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'on_delivery' | 'offline'>('available');
  const [assignedBookings, setAssignedBookings] = useState<any[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<any[]>([]);
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);

  // Dialog states
  const [showProofOfDelivery, setShowProofOfDelivery] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Form states
  const [deliveryPhoto, setDeliveryPhoto] = useState<File | null>(null);
  const [customerSignature, setCustomerSignature] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'driver') {
      navigate('/driver/login');
      return;
    }
    loadDriverData();
  }, [user, navigate]);

  const loadDriverData = () => {
    const allBookings = getAllBookings();

    // Get bookings assigned to this driver
    const driverBookings = allBookings.filter((b: any) =>
      b.driver_id === `driver_${user?.email.split('@')[0]?.split('.')[0]}`
    );

    // Separate by status
    const pending = driverBookings.filter(b => b.status === 'assigned');
    const active = driverBookings.filter(b => ['packing_started', 'in_transit', 'out_for_delivery'].includes(b.status));
    const completed = driverBookings.filter(b => b.status === 'delivered');

    setPendingAssignments(pending);
    setAssignedBookings(active);
    setCompletedBookings(completed);
  };

  const handleAcceptAssignment = (booking: any) => {
    toast.success(`Assignment accepted for ${booking.booking_number}`);
    updateBookingStatus(booking, 'packing_started');
    setAvailabilityStatus('on_delivery');
  };

  const handleRejectAssignment = (booking: any) => {
    toast.error(`Assignment rejected for ${booking.booking_number}`);
    // In production, this would notify admin and reassign
    const updatedBookings = getAllBookings().map(b =>
      b.booking_number === booking.booking_number
        ? { ...b, status: 'confirmed', driver_id: null }
        : b
    );
    localStorage.setItem('seed_bookings', JSON.stringify(updatedBookings));
    loadDriverData();
  };

  const handleUpdateStage = (booking: any, stage: string) => {
    const stageLabel = DELIVERY_STAGES.find(s => s.value === stage)?.label;
    toast.success(`Status updated to: ${stageLabel}`);
    updateBookingStatus(booking, stage);
  };

  const updateBookingStatus = (booking: any, status: string) => {
    const allBookings = getAllBookings();
    const updatedBookings = allBookings.map(b =>
      b.booking_number === booking.booking_number
        ? { ...b, status, updated_at: new Date().toISOString() }
        : b
    );
    localStorage.setItem('seed_bookings', JSON.stringify(updatedBookings));
    loadDriverData();
  };

  const handleToggleAvailability = () => {
    const newStatus = isAvailable ? 'offline' : 'available';
    setIsAvailable(!isAvailable);
    setAvailabilityStatus(newStatus);
    toast.success(
      newStatus === 'available'
        ? 'You are now available for new assignments'
        : 'You are now offline'
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDeliveryPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Photo uploaded successfully');
    }
  };

  const handleVerifyOtp = () => {
    // Mock OTP verification (in production, verify against server)
    const correctOtp = '123456';

    if (otpCode === correctOtp) {
      toast.success('OTP verified successfully!');
      setShowOtpVerification(false);
      setShowProofOfDelivery(true);
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const handleSubmitProofOfDelivery = () => {
    if (!deliveryPhoto) {
      toast.error('Please upload delivery photo');
      return;
    }

    if (!customerSignature) {
      toast.error('Please get customer signature');
      return;
    }

    toast.success('Delivery completed successfully!');
    updateBookingStatus(selectedBooking, 'delivered');

    // Reset form
    setDeliveryPhoto(null);
    setCustomerSignature('');
    setDeliveryNotes('');
    setPhotoPreview('');
    setShowProofOfDelivery(false);

    // Update availability
    if (assignedBookings.length === 1) {
      setAvailabilityStatus('available');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/driver/login');
  };

  const getAvailabilityColor = () => {
    const colors = {
      available: 'bg-green-500',
      on_delivery: 'bg-orange-500',
      offline: 'bg-gray-500'
    };
    return colors[availabilityStatus];
  };

  const getAvailabilityLabel = () => {
    const labels = {
      available: 'Available',
      on_delivery: 'On Delivery',
      offline: 'Offline'
    };
    return labels[availabilityStatus];
  };

  const stats = {
    pendingAssignments: pendingAssignments.length,
    activeDeliveries: assignedBookings.length,
    completedToday: completedBookings.filter(b => {
      const today = new Date().toDateString();
      return new Date(b.updated_at || b.created_at).toDateString() === today;
    }).length,
    totalEarnings: user?.total_earnings || 445000,
    rating: user?.rating || 4.9
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.full_name}</h1>
                <p className="text-sm text-orange-100 flex items-center gap-2 mt-1">
                  {user?.vehicle_number} • {user?.vehicle_type}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Availability Toggle */}
              <Card className="bg-white/20 border-white/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">Status:</span>
                      <span className="text-xs text-orange-100">{getAvailabilityLabel()}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${getAvailabilityColor()} animate-pulse`}></div>
                      <Switch
                        checked={isAvailable}
                        onCheckedChange={handleToggleAvailability}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90 mb-1">New Assignments</p>
                    <p className="text-3xl font-bold">{stats.pendingAssignments}</p>
                  </div>
                  <Bell className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Active Deliveries</p>
                    <p className="text-3xl font-bold">{stats.activeDeliveries}</p>
                  </div>
                  <Package className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Completed Today</p>
                    <p className="text-3xl font-bold">{stats.completedToday}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Total Earnings</p>
                    <p className="text-3xl font-bold">₹{(stats.totalEarnings / 1000).toFixed(0)}K</p>
                  </div>
                  <DollarSign className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90 mb-1">My Rating</p>
                    <p className="text-3xl font-bold flex items-center gap-2">
                      {stats.rating}
                      <Star className="w-6 h-6 fill-white" />
                    </p>
                  </div>
                  <Star className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Tabs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">My Deliveries</h2>
          <Button
            onClick={loadDriverData}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              New Assignments ({stats.pendingAssignments})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active Deliveries ({stats.activeDeliveries})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
            </TabsTrigger>
          </TabsList>

          {/* PENDING ASSIGNMENTS TAB */}
          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingAssignments.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No new assignments</p>
                  </CardContent>
                </Card>
              ) : (
                pendingAssignments.map((booking, index) => (
                  <motion.div
                    key={booking.booking_number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-xl border-2 border-yellow-200">
                      <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {booking.booking_number}
                              </h3>
                              <p className="text-sm text-gray-600">{booking.service_type}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-green-600 mt-1" />
                                <div>
                                  <p className="text-xs text-gray-500">Pickup</p>
                                  <p className="font-medium text-sm">{booking.pickup_address}</p>
                                  <p className="text-xs text-gray-600">{booking.pickup_city}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-red-600 mt-1" />
                                <div>
                                  <p className="text-xs text-gray-500">Delivery</p>
                                  <p className="font-medium text-sm">{booking.delivery_address}</p>
                                  <p className="text-xs text-gray-600">{booking.delivery_city}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                {booking.distance_km} km
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {booking.pickup_date}
                              </span>
                            </div>
                          </div>

                          <div className="lg:w-64 space-y-3">
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => handleAcceptAssignment(booking)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accept Assignment
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleRejectAssignment(booking)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => navigate(`/enhanced-tracking?booking=${booking.booking_number}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* ACTIVE DELIVERIES TAB */}
          <TabsContent value="active">
            <div className="space-y-4">
              {assignedBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No active deliveries</p>
                  </CardContent>
                </Card>
              ) : (
                assignedBookings.map((booking, index) => (
                  <motion.div
                    key={booking.booking_number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-xl border-2 border-orange-200">
                      <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {booking.booking_number}
                              </h3>
                              <Badge className="bg-orange-100 text-orange-800">
                                {booking.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-green-600 mt-1" />
                                <div>
                                  <p className="text-xs text-gray-500">Pickup</p>
                                  <p className="font-medium text-sm">{booking.pickup_city}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-red-600 mt-1" />
                                <div>
                                  <p className="text-xs text-gray-500">Delivery</p>
                                  <p className="font-medium text-sm">{booking.delivery_city}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-64 space-y-3">
                            {/* Update Stage Buttons */}
                            {booking.status !== 'delivered' && DELIVERY_STAGES.map(stage => {
                              const Icon = stage.icon;
                              return (
                                <Button
                                  key={stage.value}
                                  className="w-full"
                                  variant={booking.status === stage.value ? 'default' : 'outline'}
                                  onClick={() => handleUpdateStage(booking, stage.value)}
                                  disabled={booking.status === stage.value}
                                >
                                  <Icon className="w-4 h-4 mr-2" />
                                  Mark as {stage.label}
                                </Button>
                              );
                            })}

                            {/* Complete Delivery with OTP */}
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowOtpVerification(true);
                              }}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Complete Delivery (OTP)
                            </Button>

                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => navigate(`/enhanced-tracking?booking=${booking.booking_number}`)}
                            >
                              <Navigation className="w-4 h-4 mr-2" />
                              Navigate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* COMPLETED TAB */}
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Deliveries</CardTitle>
                <CardDescription>Your delivery history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedBookings.slice(0, 10).map((booking, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div>
                        <p className="font-bold text-gray-900">{booking.booking_number}</p>
                        <p className="text-sm text-gray-600">
                          {booking.pickup_city} → {booking.delivery_city}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Delivered
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* OTP Verification Dialog */}
        <Dialog open={showOtpVerification} onOpenChange={setShowOtpVerification}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                OTP Verification
              </DialogTitle>
              <DialogDescription>
                Enter the OTP received by customer for booking {selectedBooking?.booking_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>6-Digit OTP</Label>
                <Input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl font-bold tracking-widest"
                />
                <p className="text-xs text-gray-500 mt-2">Demo OTP: 123456</p>
              </div>
              <Button className="w-full" onClick={handleVerifyOtp}>
                <Send className="w-4 h-4 mr-2" />
                Verify OTP
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Proof of Delivery Dialog */}
        <Dialog open={showProofOfDelivery} onOpenChange={setShowProofOfDelivery}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-6 h-6 text-blue-600" />
                Proof of Delivery
              </DialogTitle>
              <DialogDescription>
                Upload delivery proof for {selectedBooking?.booking_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Photo Upload */}
              <div>
                <Label>Delivery Photo *</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Delivery proof"
                        className="h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload delivery photo</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Customer Signature */}
              <div>
                <Label>Customer Signature *</Label>
                <Input
                  type="text"
                  placeholder="Customer full name"
                  value={customerSignature}
                  onChange={(e) => setCustomerSignature(e.target.value)}
                />
              </div>

              {/* Delivery Notes */}
              <div>
                <Label>Delivery Notes (Optional)</Label>
                <Textarea
                  placeholder="Any additional notes about the delivery..."
                  rows={3}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleSubmitProofOfDelivery}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit & Complete Delivery
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
