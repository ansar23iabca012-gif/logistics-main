import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Download,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Eye,
  Edit,
  Send,
  FileText,
  Users,
  Activity,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';
import { getAllBookings, getDrivers, getAllPayments } from '../../lib/seedData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

// Shipment stages
const SHIPMENT_STAGES = [
  { value: 'pending', label: 'Pending Approval', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'confirmed', label: 'Booking Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  { value: 'assigned', label: 'Driver Assigned', color: 'bg-purple-100 text-purple-800', icon: User },
  { value: 'packing_started', label: 'Packing Started', color: 'bg-indigo-100 text-indigo-800', icon: Package },
  { value: 'in_transit', label: 'In Transit', color: 'bg-orange-100 text-orange-800', icon: Truck },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-amber-100 text-amber-800', icon: TrendingUp },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle }
];

// Payment statuses
const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'partial', label: 'Partial', color: 'bg-blue-100 text-blue-800' },
  { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'refunded', label: 'Refunded', color: 'bg-purple-100 text-purple-800' }
];

export default function AdminBookingManagementPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showAssignDriver, setShowAssignDriver] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Form states
  const [selectedDriver, setSelectedDriver] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Quotation form
  const [quotationData, setQuotationData] = useState({
    basePrice: 0,
    packingCharges: 0,
    transportCharges: 0,
    insuranceCharges: 0,
    gst: 18,
    discount: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allBookings = getAllBookings();
    const allDrivers = getDrivers();
    const allPayments = getAllPayments();

    setBookings(allBookings);
    setDrivers(allDrivers);
    setPayments(allPayments);
    setLastUpdated(new Date());
  };

  const getStageConfig = (status: string) => {
    return SHIPMENT_STAGES.find(s => s.value === status) || SHIPMENT_STAGES[0];
  };

  const getPaymentConfig = (status: string) => {
    return PAYMENT_STATUSES.find(p => p.value === status) || PAYMENT_STATUSES[0];
  };

  const handleApproveBooking = (booking: any) => {
    toast.success(`Booking ${booking.booking_number} approved!`);
    updateBookingStatus(booking, 'confirmed');
  };

  const handleRejectBooking = (booking: any) => {
    toast.error(`Booking ${booking.booking_number} rejected`);
    updateBookingStatus(booking, 'cancelled');
  };

  const handleAssignDriver = () => {
    if (!selectedDriver) {
      toast.error('Please select a driver');
      return;
    }

    const driver = drivers.find((d: any) => d.email === selectedDriver);
    if (!driver) {
      toast.error('Driver not found');
      return;
    }

    // Extract driver ID from email (e.g., ramesh.driver@aszerelocation.com -> driver_ramesh)
    const driverIdFromEmail = `driver_${selectedDriver.split('@')[0].split('.')[0]}`;

    toast.success(`Driver ${driver?.full_name} assigned to booking ${selectedBooking.booking_number}`);

    // Update booking with driver assignment AND status
    const updatedBookings = bookings.map(b =>
      b.booking_number === selectedBooking.booking_number
        ? {
            ...b,
            status: 'assigned',
            driver_id: driverIdFromEmail,
            driver_name: driver.full_name,
            driver_phone: driver.phone,
            updated_at: new Date().toISOString()
          }
        : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('seed_bookings', JSON.stringify(updatedBookings));

    setShowAssignDriver(false);
    setSelectedDriver('');
  };

  const handleStatusUpdate = () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    const stage = getStageConfig(newStatus);
    toast.success(`Status updated to: ${stage.label}`);

    updateBookingStatus(selectedBooking, newStatus);
    setShowStatusUpdate(false);
    setNewStatus('');
    setAdminNotes('');
  };

  const handlePaymentUpdate = (booking: any, status: string) => {
    toast.success(`Payment status updated to: ${status}`);
    // Update in localStorage
    const updatedBookings = bookings.map(b =>
      b.booking_number === booking.booking_number
        ? { ...b, payment_status: status }
        : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('seed_bookings', JSON.stringify(updatedBookings));
  };

  const updateBookingStatus = (booking: any, status: string) => {
    const updatedBookings = bookings.map(b =>
      b.booking_number === booking.booking_number
        ? { ...b, status, updated_at: new Date().toISOString() }
        : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('seed_bookings', JSON.stringify(updatedBookings));
  };

  const calculateQuotation = () => {
    const { basePrice, packingCharges, transportCharges, insuranceCharges, gst, discount } = quotationData;
    const subtotal = basePrice + packingCharges + transportCharges + insuranceCharges;
    const taxAmount = (subtotal * gst) / 100;
    const total = subtotal + taxAmount - discount;
    return { subtotal, taxAmount, total };
  };

  const generateQuotationPDF = () => {
    toast.success('Quotation PDF generated successfully!');
    // In production, this would generate an actual PDF
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickup_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.delivery_city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    active: bookings.filter(b => ['confirmed', 'assigned', 'packing_started', 'in_transit', 'out_for_delivery'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'delivered').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Package className="w-7 h-7" />
                  Booking Management System
                </h1>
                <p className="text-sm text-blue-100 mt-1">
                  Manage all relocation bookings • Updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={loadData}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <Package className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Pending Approval</p>
                    <p className="text-3xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Active</p>
                    <p className="text-3xl font-bold">{stats.active}</p>
                  </div>
                  <Activity className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Completed</p>
                    <p className="text-3xl font-bold">{stats.completed}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Cancelled</p>
                    <p className="text-3xl font-bold">{stats.cancelled}</p>
                  </div>
                  <XCircle className="w-10 h-10 opacity-80" />
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
                    placeholder="Search by booking number, city..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {SHIPMENT_STAGES.map(stage => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => {
            const stageConfig = getStageConfig(booking.status);
            const paymentConfig = getPaymentConfig(booking.payment_status);
            const StatusIcon = stageConfig.icon;

            return (
              <motion.div
                key={booking.booking_number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="shadow-xl hover:shadow-2xl transition-all border-2 border-blue-100">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left Section - Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                              {booking.booking_number}
                              <Badge className={stageConfig.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {stageConfig.label}
                              </Badge>
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{booking.service_type}</p>
                          </div>
                          <Badge className={paymentConfig.color}>
                            <DollarSign className="w-3 h-3 mr-1" />
                            {paymentConfig.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-green-600 mt-1" />
                            <div>
                              <p className="text-xs text-gray-500">Pickup</p>
                              <p className="font-medium text-sm">{booking.pickup_city}, {booking.pickup_state}</p>
                              <p className="text-xs text-gray-500">{booking.pickup_date}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-red-600 mt-1" />
                            <div>
                              <p className="text-xs text-gray-500">Delivery</p>
                              <p className="font-medium text-sm">{booking.delivery_city}, {booking.delivery_state}</p>
                              <p className="text-xs text-gray-500">{booking.estimated_delivery || 'TBD'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {booking.distance_km} km
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ₹{booking.final_price?.toLocaleString() || booking.price_estimate?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Right Section - Action Buttons */}
                      <div className="lg:w-80 space-y-3">
                        {/* Approve/Reject for Pending */}
                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveBooking(booking)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              className="flex-1 bg-red-600 hover:bg-red-700"
                              onClick={() => handleRejectBooking(booking)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {/* Assign Driver */}
                        {['confirmed', 'pending'].includes(booking.status) && (
                          <Button
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowAssignDriver(true);
                            }}
                          >
                            <User className="w-4 h-4 mr-2" />
                            Assign Driver
                          </Button>
                        )}

                        {/* Update Status */}
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setNewStatus(booking.status);
                            setShowStatusUpdate(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Update Status
                        </Button>

                        {/* Payment Status Update */}
                        <Select
                          value={booking.payment_status}
                          onValueChange={(value) => handlePaymentUpdate(booking, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Update Payment" />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_STATUSES.map(status => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Generate Quotation */}
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setQuotationData({
                              basePrice: booking.price_estimate || 35000,
                              packingCharges: 5000,
                              transportCharges: 8000,
                              insuranceCharges: 2000,
                              gst: 18,
                              discount: 0
                            });
                            setShowQuotation(true);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Quotation
                        </Button>

                        {/* View Details */}
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(`/enhanced-tracking?booking=${booking.booking_number}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Assign Driver Dialog */}
        <Dialog open={showAssignDriver} onOpenChange={setShowAssignDriver}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Driver</DialogTitle>
              <DialogDescription>
                Select an available driver for booking {selectedBooking?.booking_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Available Drivers</Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.filter((d: any) => d.is_available).map((driver: any) => (
                      <SelectItem key={driver.email} value={driver.email}>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {driver.full_name} - {driver.vehicle_number}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleAssignDriver}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Assign Driver
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Shipment Status</DialogTitle>
              <DialogDescription>
                Update status for booking {selectedBooking?.booking_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Shipment Stage</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIPMENT_STAGES.map(stage => {
                      const Icon = stage.icon;
                      return (
                        <SelectItem key={stage.value} value={stage.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {stage.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Admin Notes (Optional)</Label>
                <Textarea
                  placeholder="Add notes about this status update..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <Button className="w-full" onClick={handleStatusUpdate}>
                <Send className="w-4 h-4 mr-2" />
                Update Status
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Quotation Generator Dialog */}
        <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate Quotation</DialogTitle>
              <DialogDescription>
                Create detailed quotation for booking {selectedBooking?.booking_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Base Price</Label>
                  <Input
                    type="number"
                    value={quotationData.basePrice}
                    onChange={(e) => setQuotationData({ ...quotationData, basePrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Packing Charges</Label>
                  <Input
                    type="number"
                    value={quotationData.packingCharges}
                    onChange={(e) => setQuotationData({ ...quotationData, packingCharges: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Transport Charges</Label>
                  <Input
                    type="number"
                    value={quotationData.transportCharges}
                    onChange={(e) => setQuotationData({ ...quotationData, transportCharges: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Insurance Charges</Label>
                  <Input
                    type="number"
                    value={quotationData.insuranceCharges}
                    onChange={(e) => setQuotationData({ ...quotationData, insuranceCharges: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>GST (%)</Label>
                  <Input
                    type="number"
                    value={quotationData.gst}
                    onChange={(e) => setQuotationData({ ...quotationData, gst: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Discount</Label>
                  <Input
                    type="number"
                    value={quotationData.discount}
                    onChange={(e) => setQuotationData({ ...quotationData, discount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₹{calculateQuotation().subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({quotationData.gst}%):</span>
                    <span className="font-semibold">₹{calculateQuotation().taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-semibold text-red-600">-₹{quotationData.discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">₹{calculateQuotation().total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={generateQuotationPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download Quotation PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
