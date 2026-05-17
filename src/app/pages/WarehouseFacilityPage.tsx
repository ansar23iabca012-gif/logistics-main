import { Warehouse, Shield, Clock, Package, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import { supabase, checkSupabaseConfig } from '../../lib/supabase';

export default function WarehouseFacilityPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    storageType: '',
    spaceRequired: '',
    duration: '',
    location: '',
    itemsDescription: '',
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
      alert(`⚠️ Database Not Configured\n\nSupabase backend is not set up yet.\n\n📖 See SUPABASE_SETUP.md for instructions.`);
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('quote_requests')
        .insert([
          {
            service_type: 'Warehouse Facility',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            branch: formData.location,
            additional_details: `Company: ${formData.companyName}\nStorage Type: ${formData.storageType}\nSpace Required: ${formData.spaceRequired}\nDuration: ${formData.duration}\nItems Description: ${formData.itemsDescription}\n\n${formData.message}`
          }
        ]);

      if (error) throw error;

      alert(`Warehouse Facility Request Submitted!\n\nName: ${formData.name}\nCompany: ${formData.companyName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nStorage Type: ${formData.storageType}\n\nWe'll contact you shortly!`);

      setFormData({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        storageType: '',
        spaceRequired: '',
        duration: '',
        location: '',
        itemsDescription: '',
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
              <Warehouse className="w-12 h-12" />
            </div>
            <h1 className="text-5xl font-bold">Warehouse Facility Services</h1>
          </div>
          <p className="text-xl text-white/80 max-w-3xl">
            Secure storage solutions with state-of-the-art facilities. Short-term and long-term warehousing options available.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1a2545] mb-12 text-center">Why Choose Our Warehouse Facility?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-[#f5f1e8] rounded-xl hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-[#4a5fc1] to-[#8b5cf6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2545] mb-3">24/7 Security</h3>
              <p className="text-gray-600">Round-the-clock surveillance and security personnel</p>
            </div>
            <div className="text-center p-6 bg-[#f5f1e8] rounded-xl hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-[#4a5fc1] to-[#8b5cf6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2545] mb-3">Flexible Terms</h3>
              <p className="text-gray-600">Short-term and long-term storage options available</p>
            </div>
            <div className="text-center p-6 bg-[#f5f1e8] rounded-xl hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-[#4a5fc1] to-[#8b5cf6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2545] mb-3">Climate Control</h3>
              <p className="text-gray-600">Temperature and humidity controlled storage areas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 bg-[#f5f1e8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a2545] to-[#2a3555] text-white p-8">
              <h2 className="text-3xl font-bold mb-2">Request Warehouse Facility</h2>
              <p className="text-white/80">Fill out the form below and our warehouse team will contact you</p>
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
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                    placeholder="Optional"
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
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Storage Type *</label>
                  <select
                    name="storageType"
                    value={formData.storageType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                  >
                    <option value="">Select storage type</option>
                    <option value="General Storage">General Storage</option>
                    <option value="Climate Controlled">Climate Controlled</option>
                    <option value="High Security">High Security Storage</option>
                    <option value="Cold Storage">Cold Storage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Space Required *</label>
                  <select
                    name="spaceRequired"
                    value={formData.spaceRequired}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                  >
                    <option value="">Select space requirement</option>
                    <option value="Small (Up to 500 sq ft)">Small (Up to 500 sq ft)</option>
                    <option value="Medium (500-1500 sq ft)">Medium (500-1500 sq ft)</option>
                    <option value="Large (1500-3000 sq ft)">Large (1500-3000 sq ft)</option>
                    <option value="Extra Large (3000+ sq ft)">Extra Large (3000+ sq ft)</option>
                    <option value="Custom Size">Custom Size (Will Discuss)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Storage Duration *</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                  >
                    <option value="">Select duration</option>
                    <option value="Short Term (1-3 months)">Short Term (1-3 months)</option>
                    <option value="Medium Term (3-6 months)">Medium Term (3-6 months)</option>
                    <option value="Long Term (6-12 months)">Long Term (6-12 months)</option>
                    <option value="Extended (12+ months)">Extended (12+ months)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Preferred Location *</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                  >
                    <option value="">Select location</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Delhi-NCR">Delhi-NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Items Description *</label>
                  <input
                    type="text"
                    name="itemsDescription"
                    value={formData.itemsDescription}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a]"
                    placeholder="e.g., Household goods, Office equipment, Inventory"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#1a2545] mb-2">Additional Information</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] resize-none"
                    placeholder="Special requirements, handling instructions, or any other details..."
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
