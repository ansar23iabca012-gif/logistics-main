import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { supabase, checkSupabaseConfig } from '../../lib/supabase';

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if Supabase is configured
    if (!checkSupabaseConfig()) {
      alert(`⚠️ Database Not Configured\n\nSupabase backend is not set up yet. Your form data:\n\nName: ${contactForm.name}\nEmail: ${contactForm.email}\nPhone: ${contactForm.phone}\nSubject: ${contactForm.subject}\nMessage: ${contactForm.message}\n\n📖 Please see SUPABASE_SETUP.md to complete the setup.`);
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: contactForm.name,
            email: contactForm.email,
            phone: contactForm.phone,
            message: `Subject: ${contactForm.subject}\n\n${contactForm.message}`
          }
        ]);

      if (error) throw error;

      alert(`Thank you for contacting us!\n\nYour message has been sent successfully.\n\nName: ${contactForm.name}\nEmail: ${contactForm.email}\nPhone: ${contactForm.phone}\nSubject: ${contactForm.subject}\n\nWe'll get back to you soon!`);

      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Sorry, there was an error submitting your message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-[#f5f1e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#1a2545] mb-4">Contact Us</h1>
          <p className="text-xl text-gray-700">
            ASZE RELOCATION • 
            <button
              onClick={scrollToForm}
              className="ml-2 text-[#c93a3a] hover:text-[#1a2545] font-semibold underline transition cursor-pointer"
            >
              Get in Touch
            </button>
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address Card */}
          <div className="bg-white border-2 border-[#1a2545]/20 rounded-xl p-8 text-center hover:shadow-xl transition">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4a5fc1] to-[#8b5cf6] rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#1a2545] mb-4">Address</h3>
            <p className="text-gray-700 leading-relaxed">
              Symphony Workspace, #23, Level 1,<br />
              Hennur Main Road, opposite Holy<br />
              Redeemer Church, Bangalore, Karnataka<br />
              560043
            </p>
          </div>

          {/* Contact Number Card */}
          <div className="bg-white border-2 border-[#1a2545]/20 rounded-xl p-8 text-center hover:shadow-xl transition">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4a5fc1] to-[#8b5cf6] rounded-2xl flex items-center justify-center shadow-lg">
                <Phone className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#1a2545] mb-4">Contact Number</h3>
            <p className="text-gray-700 mb-3">
              <strong>Phone Number:</strong><br />
              <a href="tel:+916200573418" className="text-[#1a2545] hover:text-[#c93a3a] transition text-lg">
                (+91) 620 057 3418
              </a>
            </p>
            <p className="text-gray-700">
              <strong>Toll Free Number:</strong><br />
              <a href="tel:18001706200" className="text-[#1a2545] hover:text-[#c93a3a] transition text-lg">
                1800 170 6200
              </a>
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-white border-2 border-[#1a2545]/20 rounded-xl p-8 text-center hover:shadow-xl transition">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4a5fc1] to-[#8b5cf6] rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#1a2545] mb-4">Email</h3>
            <p className="text-gray-700">
              <a href="mailto:info@aszerelocation.com" className="text-[#1a2545] hover:text-[#c93a3a] transition break-all text-lg">
                info@aszerelocation.com
              </a>
            </p>
          </div>
        </div>

        {/* Reach Out Section */}
        <div id="contact-form-section" className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white px-12 pt-12 pb-8">
            <h1 className="text-5xl font-bold text-[#1a2545] mb-4">Reach Out for Remarkable Moves</h1>
            <p className="text-lg text-gray-700">
              Moving to a new home or office? Let R M Packers & Movers take care of all your packing and moving needs. Our dedicated team is ready to assist you every step of the way.
            </p>
          </div>

          {/* Form and Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Side - Form */}
            <div className="bg-[#f0f0f5] p-12">
              <form onSubmit={handleContactFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactFormChange}
                      required
                      placeholder="Name"
                      className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactFormChange}
                      required
                      placeholder="Your Email"
                      className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactFormChange}
                      required
                      placeholder="Phone Number"
                      className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <select
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactFormChange}
                      required
                      className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] text-gray-400"
                    >
                      <option value="">Subject type</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Home Relocation">Home Relocation</option>
                      <option value="Office Relocation">Office Relocation</option>
                      <option value="Fine Art Logistics">Fine Art Logistics</option>
                      <option value="Car Relocation">Car Relocation</option>
                      <option value="Warehouse Facility">Warehouse Facility</option>
                      <option value="Get a Quote">Get a Quote</option>
                      <option value="Track Shipment">Track Shipment</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    required
                    rows={6}
                    placeholder="Your Message"
                    className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] resize-none placeholder:text-gray-400"
                  />
                </div>

                <div className="flex">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#c93a3a] text-white px-10 py-4 rounded-l-lg hover:bg-[#a83030] transition font-bold text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#1a2545] text-white px-6 py-4 rounded-r-lg hover:bg-[#0f1829] transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side - Map */}
            <div className="bg-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.4404573371377!2d77.63729931482186!3d13.010850990835937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17d7e61a2b07%3A0x6c8b0c8c0c8b0c8b!2sHennur%20Main%20Road%2C%20Bangalore%2C%20Karnataka%20560043!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '600px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ASZE Relocation Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}