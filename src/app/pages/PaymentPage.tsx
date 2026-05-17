import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import {
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Lock,
  DollarSign,
  FileText,
  Download
} from 'lucide-react';
import { getAllBookings } from '../../lib/seedData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingNumber = searchParams.get('booking');

  const [booking, setBooking] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe' | 'paypal'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (bookingNumber) {
      loadBookingData();
    }
  }, [bookingNumber]);

  const loadBookingData = () => {
    const allBookings = getAllBookings();
    const foundBooking = allBookings.find((b: any) => b.booking_number === bookingNumber);
    setBooking(foundBooking);
  };

  const processPayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate successful payment
    setPaymentSuccess(true);
    setIsProcessing(false);

    toast.success('Payment processed successfully!');

    // Generate invoice
    setTimeout(() => {
      generateInvoice();
    }, 1000);
  };

  const handleRazorpayPayment = () => {
    // In production, integrate with Razorpay SDK
    toast.info('Redirecting to Razorpay...');
    processPayment();
  };

  const handleStripePayment = () => {
    // In production, integrate with Stripe SDK
    toast.info('Redirecting to Stripe...');
    processPayment();
  };

  const handlePayPalPayment = () => {
    // In production, integrate with PayPal SDK
    toast.info('Redirecting to PayPal...');
    processPayment();
  };

  const generateInvoice = () => {
    const invoice = {
      invoiceNumber: `INV${Date.now()}`,
      bookingNumber: booking.booking_number,
      date: new Date().toLocaleDateString(),
      amount: booking.final_price || booking.price_estimate
    };

    toast.success('Invoice generated successfully!');
    console.log('Invoice:', invoice);
  };

  const downloadInvoice = () => {
    toast.success('Invoice downloaded!');
  };

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
              We couldn't find a booking to process payment for.
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-2 border-green-200">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <CardTitle className="text-2xl text-green-900">Payment Successful!</CardTitle>
              <CardDescription>
                Your payment has been processed successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Booking Number</span>
                  <span className="font-medium">{booking.booking_number}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="font-bold text-lg">₹{(booking.final_price || booking.price_estimate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transaction ID</span>
                  <span className="font-medium text-xs">TXN{Date.now()}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full" onClick={downloadInvoice}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/tracking')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Track Shipment
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/')}>
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const amount = booking.final_price || booking.price_estimate;
  const advanceAmount = Math.floor(amount * 0.5); // 50% advance

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Details
                </CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <div className="space-y-3">
                    {/* Razorpay */}
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'razorpay'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="razorpay" id="razorpay" className="mr-3" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">Razorpay</div>
                          <Badge variant="secondary">Recommended</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          UPI, Cards, Net Banking, Wallets
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">₹</div>
                    </label>

                    {/* Stripe */}
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'stripe'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="stripe" id="stripe" className="mr-3" />
                      <div className="flex-1">
                        <div className="font-medium">Stripe</div>
                        <p className="text-xs text-gray-500 mt-1">
                          International Cards, Apple Pay, Google Pay
                        </p>
                      </div>
                      <CreditCard className="w-6 h-6 text-indigo-600" />
                    </label>

                    {/* PayPal */}
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="paypal" id="paypal" className="mr-3" />
                      <div className="flex-1">
                        <div className="font-medium">PayPal</div>
                        <p className="text-xs text-gray-500 mt-1">
                          PayPal Balance, Cards
                        </p>
                      </div>
                      <div className="text-xl font-bold text-blue-700">P</div>
                    </label>
                  </div>
                </RadioGroup>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your payment information is encrypted and secure. We do not store your card details.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 h-12 text-lg"
                  disabled={isProcessing}
                  onClick={() => {
                    if (paymentMethod === 'razorpay') handleRazorpayPayment();
                    else if (paymentMethod === 'stripe') handleStripePayment();
                    else if (paymentMethod === 'paypal') handlePayPalPayment();
                  }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Pay ₹{amount.toLocaleString()}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Payment Integration Info */}
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Development Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-amber-800">
                  This is a demo payment gateway. In production, integrate actual payment APIs:
                </p>
                <ul className="text-xs text-amber-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Razorpay SDK: https://razorpay.com/docs/</li>
                  <li>Stripe SDK: https://stripe.com/docs/</li>
                  <li>PayPal SDK: https://developer.paypal.com/</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Booking Number</p>
                  <p className="font-medium">{booking.booking_number}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Service</p>
                  <p className="font-medium">{booking.service_type}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Route</p>
                  <p className="text-sm">{booking.pickup_city} → {booking.delivery_city}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Amount</span>
                    <span>₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%)</span>
                    <span>₹{Math.floor(amount * 0.18).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-bold">Total Amount</span>
                    <span className="font-bold text-lg">₹{Math.floor(amount * 1.18).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs font-medium text-green-900">Advance Payment Option</p>
                  <p className="text-xs text-green-700 mt-1">
                    Pay 50% (₹{advanceAmount.toLocaleString()}) now and rest on delivery
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Payment Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Instant payment confirmation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Secure encrypted transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Digital invoice generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Easy refund process</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
