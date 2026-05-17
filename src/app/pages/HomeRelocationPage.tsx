import { Home, Package, Truck, Shield, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { supabase, checkSupabaseConfig } from '../../lib/supabase';

export default function HomeRelocationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    fromLocation: '',
    toLocation: '',
    movingDate: '',
    propertySize: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!checkSupabaseConfig()) {
      alert(`⚠️ Database Not Configured\n\nSupabase backend is not set up yet.\n\n📖 See SUPABASE_SETUP.md for instructions.\n\nYour request details:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nFrom: ${formData.fromLocation}\nTo: ${formData.toLocation}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('quote_requests')
        .insert([
          {
            service_type: 'Home Relocation',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            moving_from: formData.fromLocation,
            moving_to: formData.toLocation,
            moving_date: formData.movingDate,
            additional_details: `Property Size: ${formData.propertySize}\n\n${formData.message}`
          }
        ]);

      if (error) throw error;

      alert(`Home Relocation Request Submitted!\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nFrom: ${formData.fromLocation}\nTo: ${formData.toLocation}\nMoving Date: ${formData.movingDate}\nProperty Size: ${formData.propertySize}\n\nWe'll contact you shortly!`);

      setFormData({
        name: '',
        email: '',
        phone: '',
        fromLocation: '',
        toLocation: '',
        movingDate: '',
        propertySize: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting quote request:', error);
      alert('Sorry, there was an error submitting your request. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f5f1e8] min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1a2545] to-[#2a3555] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#c93a3a] p-4 rounded-xl">
              <Home className="w-12 h-12" />
            </div>
            <h1 className="text-5xl font-bold">Home Relocation Services</h1>
          </div>
          <p className="text-xl text-white/80 max-w-3xl">
            Professional and stress-free home moving services across India. We handle your belongings with care and precision.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1a2545] mb-12 text-center">Why Choose Our Home Relocation Service?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-[#f5f1e8] rounded-xl hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-[#4a5fc1] to-[#8b5cf6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2545] mb-3">Professional Packing</h3>
              <p className="text-gray-600">Expert packing with high-quality materials to ensure safety of your belongings</p>
            </div>
            <div className="text-center p-6 bg-[#f5f1e8] rounded-xl hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-[#4a5fc1] to-[#8b5cf6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2545] mb-3">Safe Transportation</h3>
              <p className="text-gray-600">Modern fleet of vehicles with GPS tracking for secure delivery</p>
            </div>
            <div className="text-center p-6 bg-[#f5f1e8] rounded-xl hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-[#4a5fc1] to-[#8b5cf6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2545] mb-3">Insurance Coverage</h3>
              <p className="text-gray-600">Comprehensive insurance options for complete peace of mind</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 bg-[#f5f1e8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a2545] to-[#2a3555] text-white p-8">
              <h2 className="text-3xl font-bold mb-2">Request Home Relocation Service</h2>
              <p className="text-white/80">Fill out the form below and our team will contact you shortly</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Moving Date *</label>
                  <input
                    type="date"
                    name="movingDate"
                    value={formData.movingDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">From Location *</label>
                  <input
                    type="text"
                    name="fromLocation"
                    value={formData.fromLocation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                    placeholder="Current address/city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">To Location *</label>
                  <input
                    type="text"
                    name="toLocation"
                    value={formData.toLocation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                    placeholder="Destination address/city"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Property Size *</label>
                  <select
                    name="propertySize"
                    value={formData.propertySize}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                  >
                    <option value="">Select property size</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4+ BHK">4+ BHK</option>
                    <option value="Villa/Independent House">Villa/Independent House</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Additional Information</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] resize-none"
                    placeholder="Any special requirements or items that need special care..."
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#c93a3a] text-white py-4 px-6 rounded-lg hover:bg-[#a83030] transition font-semibold shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <a
                  href="tel:+916200573418"
                  className="flex-1 bg-[#4a5fc1] text-white py-4 px-6 rounded-lg hover:bg-[#3a4fb1] transition font-semibold shadow-lg text-lg flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Us Now
                </a>
              </div>
            </form>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-[#c93a3a] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#1a2545] mb-2">Phone</h3>
              <p className="text-gray-600">+91 620 057 3418</p>
              <p className="text-gray-600">1800 170 6200</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-[#c93a3a] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#1a2545] mb-2">Email</h3>
              <p className="text-gray-600">
                <a href="mailto:info@aszerelocation.com" className="hover:text-[#c93a3a] transition">
                  info@aszerelocation.com
                </a>
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-[#c93a3a] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#1a2545] mb-2">Locations</h3>
              <p className="text-gray-600">5 Branches Across India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
