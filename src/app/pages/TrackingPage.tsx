import { useState } from 'react';
import { Package, Search, MapPin, Truck, CheckCircle, Clock } from 'lucide-react';

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock tracking data
      setTrackingResult({
        trackingNumber: trackingNumber,
        status: 'In Transit',
        estimatedDelivery: '2026-04-12',
        currentLocation: 'Mumbai Sorting Facility',
        shipmentDetails: {
          origin: 'Delhi',
          destination: 'Bangalore',
          serviceType: 'Home Relocation',
          weight: '500 kg',
          pieces: '25'
        },
        timeline: [
          {
            date: '2026-04-08',
            time: '09:30 AM',
            status: 'Picked Up',
            location: 'Delhi - Main Branch',
            icon: CheckCircle,
            completed: true
          },
          {
            date: '2026-04-09',
            time: '02:15 PM',
            status: 'In Transit',
            location: 'Mumbai Sorting Facility',
            icon: Truck,
            completed: true
          },
          {
            date: '2026-04-10',
            time: '11:00 AM',
            status: 'In Transit',
            location: 'Pune Hub',
            icon: Truck,
            completed: false
          },
          {
            date: '2026-04-12',
            time: 'Expected',
            status: 'Out for Delivery',
            location: 'Bangalore - Destination',
            icon: Package,
            completed: false
          }
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1a2545] to-[#2a3555] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full">
              <Package className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">Track Your Shipment</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Enter your tracking number to get real-time updates on your shipment's location and status
          </p>
        </div>
      </div>

      {/* Tracking Form */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter your tracking number (e.g., ASZE123456789)"
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#c93a3a] text-white px-8 py-3 font-bold rounded-lg hover:bg-[#a83030] transition shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Search className="w-5 h-5" />
                    {isLoading ? 'Tracking...' : 'Track'}
                  </button>
                </div>
              </div>
            </form>

            {/* Sample Tracking Numbers */}
            <div className="mt-6 p-4 bg-[#f5f1e8] rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Sample tracking numbers:</span> ASZE123456789, ASZE987654321
              </p>
            </div>
          </div>

          {/* Tracking Results */}
          {trackingResult && (
            <div className="mt-8 space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-[#f5f1e8] rounded-xl">
                    <Package className="w-12 h-12 text-[#c93a3a] mx-auto mb-3" />
                    <h3 className="font-bold text-[#1a2545] mb-1">Tracking Number</h3>
                    <p className="text-gray-600">{trackingResult.trackingNumber}</p>
                  </div>
                  <div className="text-center p-6 bg-[#f5f1e8] rounded-xl">
                    <Truck className="w-12 h-12 text-[#c93a3a] mx-auto mb-3" />
                    <h3 className="font-bold text-[#1a2545] mb-1">Current Status</h3>
                    <p className="text-gray-600">{trackingResult.status}</p>
                  </div>
                  <div className="text-center p-6 bg-[#f5f1e8] rounded-xl">
                    <Clock className="w-12 h-12 text-[#c93a3a] mx-auto mb-3" />
                    <h3 className="font-bold text-[#1a2545] mb-1">Estimated Delivery</h3>
                    <p className="text-gray-600">{trackingResult.estimatedDelivery}</p>
                  </div>
                </div>

                {/* Shipment Details */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-[#1a2545] mb-4">Shipment Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Origin</p>
                      <p className="font-semibold text-[#1a2545]">{trackingResult.shipmentDetails.origin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Destination</p>
                      <p className="font-semibold text-[#1a2545]">{trackingResult.shipmentDetails.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Service Type</p>
                      <p className="font-semibold text-[#1a2545]">{trackingResult.shipmentDetails.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Weight</p>
                      <p className="font-semibold text-[#1a2545]">{trackingResult.shipmentDetails.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Pieces</p>
                      <p className="font-semibold text-[#1a2545]">{trackingResult.shipmentDetails.pieces}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-[#1a2545] mb-8">Shipment Timeline</h3>
                <div className="relative">
                  {trackingResult.timeline.map((event: any, index: number) => (
                    <div key={index} className="relative flex gap-6 mb-8 last:mb-0">
                      {/* Icon */}
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                        event.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        <event.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className={`flex-1 pb-8 ${event.completed ? '' : 'opacity-50'}`}>
                        <div className="bg-[#f5f1e8] rounded-xl p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                            <h4 className="font-bold text-[#1a2545] text-lg">{event.status}</h4>
                            <span className="text-sm text-gray-600">{event.date} - {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-gradient-to-r from-[#1a2545] to-[#2a3555] text-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
                  <p className="text-white/80 mb-6">
                    Our customer support team is here to assist you with any questions about your shipment
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="tel:18001706200"
                      className="bg-white text-[#1a2545] px-8 py-3 rounded-lg font-semibold hover:bg-[#f5f1e8] transition"
                    >
                      Call: 1800 170 6200
                    </a>
                    <a
                      href="tel:+916200573418"
                      className="bg-[#c93a3a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#a83030] transition"
                    >
                      Call: (+91) 620 057 3418
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1a2545] mb-12 text-center">How to Track Your Shipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-[#c93a3a] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-bold text-[#1a2545] mb-2">Enter Tracking Number</h3>
              <p className="text-gray-600">
                Enter your unique tracking number provided at the time of booking
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-[#c93a3a] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-bold text-[#1a2545] mb-2">View Real-time Updates</h3>
              <p className="text-gray-600">
                Get instant access to your shipment's current location and status
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-[#c93a3a] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-bold text-[#1a2545] mb-2">Stay Informed</h3>
              <p className="text-gray-600">
                Receive updates and estimated delivery time for your shipment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}