import { Search, Phone, Mail, Facebook, Instagram, Youtube, Settings, User, LogIn } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import logoImage from '../../imports/file_000000006ac8720b979dc7466ea88e90_(1).png';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import AIChatbot from './AIChatbot';
import { handleFormError, handleFormSuccess } from '../../utils/errorHandler';
import { SERVICES } from '../../constants/services';

// Scroll to top on route change
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
}

export default function Layout() {
  const location = useLocation();
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    subjectType: '',
    message: ''
  });
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  const handleQuoteFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuoteForm(prev => ({ ...prev, [name]: value }));
  };

  const handleQuoteFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.subjectType) {
    alert('Please select a service type');
    return;
  }
  if (!quoteForm.name.trim() || !quoteForm.email.trim() || !quoteForm.phone.trim()) {
    alert('Please fill in all required fields');
    return;
  }
    setIsSubmittingQuote(true);

    try {
      const { error } = await supabase
        .from('quote_requests')
        .insert([
          {
            service_type: quoteForm.subjectType || 'General Enquiry',
            name: quoteForm.name,
            email: quoteForm.email,
            phone: quoteForm.phone,
            additional_details: quoteForm.message
          }
        ]);

      if (error) {
        throw error;
      }

      handleFormSuccess('quote request', `We'll contact you shortly about ${quoteForm.subjectType}!`);

      setQuoteForm({
        name: '',
        email: '',
        phone: '',
        subjectType: '',
        message: ''
      });
      setShowQuoteModal(false);
    } catch (error: any) {
      handleFormError(error, 'quote request', quoteForm);
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSuccess('search', `Searching for: ${searchQuery}`);
    setSearchQuery('');
    setShowSearchModal(false);
  };

  return (
    <div className="size-full overflow-y-auto bg-[#f5f1e8]">
      <ScrollToTop />
      {/* Top Header Bar - Glass Style */}
      <div className="glass-dark text-white py-2 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <motion.a
              href="tel:+916200573418"
              className="flex items-center gap-2 hover:text-[#e8b647] transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-4 h-4" />
              <span>Call for help: (+91) 620 057 3418</span>
            </motion.a>
            <motion.a
              href="tel:18001706200"
              className="flex items-center gap-2 hover:text-[#e8b647] transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-4 h-4" />
              <span>Toll Free: 1800 170 6200</span>
            </motion.a>
          </div>
          <div className="flex items-center gap-4 relative">
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e8b647] transition"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Facebook className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e8b647] transition"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e8b647] transition"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Youtube className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Main Navigation - Glass Style */}
      <header className="glass-light shadow-float sticky top-0 z-50 backdrop-blur-xl border-b border-white/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src={logoImage} 
                  alt="ASZE RELOCATION Logo" 
                  className="h-20 w-auto object-contain mix-blend-multiply"
                />
              </Link>
            </motion.div>
            
            {/* Navigation Links */}
            <div className="hidden lg:flex gap-8 items-center">
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/" className="text-[#1a2545] hover:text-[#c93a3a] transition font-semibold uppercase text-sm">Home</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/about" className="text-[#1a2545] hover:text-[#c93a3a] transition font-semibold uppercase text-sm">About Us</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/services" className="text-[#1a2545] hover:text-[#c93a3a] transition font-semibold uppercase text-sm">Services</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/branches" className="text-[#1a2545] hover:text-[#c93a3a] transition font-semibold uppercase text-sm">Branches</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/gallery" className="text-[#1a2545] hover:text-[#c93a3a] transition font-semibold uppercase text-sm">Gallery</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/tracking" className="text-[#1a2545] hover:text-[#c93a3a] transition font-semibold uppercase text-sm">Tracking</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/reviews" className="text-[#1a2545] hover:text-[#c93a3a] transition font-semibold uppercase text-sm">Reviews</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/contact" className="text-[#1a2545] hover:text-[#c93a3a] transition font-semibold uppercase text-sm">Contact Us</Link>
              </motion.div>
            </div>

            {/* Search and Quote Button */}
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={() => setShowSearchModal(true)}
                className="p-2 hover:bg-[#1a2545] hover:text-white rounded-full transition"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <Search className="w-5 h-5 text-[#1a2545]" />
              </motion.button>
              <motion.button
                onClick={() => setShowQuoteModal(true)}
                className="bg-[#c93a3a] text-white px-8 py-3 font-bold uppercase text-sm hover:bg-[#a83030] transition shadow-lg relative overflow-hidden"
                style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(201, 58, 58, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="relative z-10"
                  whileHover={{ letterSpacing: "0.05em" }}
                >
                  Get Quote
                </motion.span>
              </motion.button>

              {/* Login Button with Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                  className="flex items-center gap-2 bg-[#1a2545] text-white px-6 py-3 rounded-lg font-bold uppercase text-sm hover:bg-[#2a3555] transition shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </motion.button>

                {/* Login Dropdown */}
                <AnimatePresence>
                  {showLoginDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                      onMouseLeave={() => setShowLoginDropdown(false)}
                    >
                      <div className="p-2">
                        <Link
                          to="/admin/login"
                          onClick={() => setShowLoginDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition group"
                        >
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition">
                            <Settings className="w-5 h-5 text-[#c93a3a]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1a2545] text-sm">Admin Portal</p>
                            <p className="text-xs text-gray-500">Management Dashboard</p>
                          </div>
                        </Link>

                        <Link
                          to="/driver/login"
                          onClick={() => setShowLoginDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-yellow-50 transition group"
                        >
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition">
                            <Settings className="w-5 h-5 text-[#e8b647]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1a2545] text-sm">Driver Portal</p>
                            <p className="text-xs text-gray-500">Manage Deliveries</p>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Page Content */}
      <Outlet />

      {/* Footer - Glass Style */}
      <footer className="glass-dark text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4 text-[#e8b647]">ASZE RELOCATION</h3>
              <p className="text-white/70 mb-4">Your trusted partner in logistics excellence since 2020.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/" className="hover:text-[#e8b647] transition">Home</Link></li>
                <li><Link to="/about" className="hover:text-[#e8b647] transition">About Us</Link></li>
                <li><Link to="/branches" className="hover:text-[#e8b647] transition">Branches</Link></li>
                <li><Link to="/gallery" className="hover:text-[#e8b647] transition">Gallery</Link></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-white/70">
                {SERVICES.map(service => (
                  <li key={service.id}>
                    <Link to={service.path} className="hover:text-[#e8b647] transition">
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+916200573418" className="hover:text-[#e8b647] transition">
                    (+91) 620 057 3418
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:18001706200" className="hover:text-[#e8b647] transition">
                    1800 170 6200
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@aszerelocation.com" className="hover:text-[#e8b647] transition">
                    info@aszerelocation.com
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/70">
            <p>&copy; 2026 ASZE RELOCATION. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Quote Modal - Glass Style */}
      <AnimatePresence>
        {showQuoteModal && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuoteModal(false)}
          >
            <motion.div
              className="glass-light rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-float-lg border border-white/20"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gradient-overlay-navy text-white p-8 rounded-t-3xl border-b border-white/10">
                <h2 className="text-3xl font-bold">Get a Quote</h2>
                <p className="text-white/80 mt-2">Fill out the form and we'll get back to you soon</p>
              </div>
              <div className="p-8">
                <form onSubmit={handleQuoteFormSubmit}>
                  <div className="space-y-6">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-semibold text-[#1a2545] mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={quoteForm.name}
                        onChange={handleQuoteFormChange}
                        required
                        className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] focus:ring-2 focus:ring-[#c93a3a]/20 transition"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="block text-sm font-semibold text-[#1a2545] mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={quoteForm.email}
                        onChange={handleQuoteFormChange}
                        required
                        className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] focus:ring-2 focus:ring-[#c93a3a]/20 transition"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-semibold text-[#1a2545] mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={quoteForm.phone}
                        onChange={handleQuoteFormChange}
                        required
                        className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] focus:ring-2 focus:ring-[#c93a3a]/20 transition"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="block text-sm font-semibold text-[#1a2545] mb-2">Subject Type *</label>
                      <select
                        name="subjectType"
                        value={quoteForm.subjectType}
                        onChange={handleQuoteFormChange}
                        required
                        className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] focus:ring-2 focus:ring-[#c93a3a]/20 transition"
                      >
                        <option value="">Select a service</option>
                        {SERVICES.map(service => (
                          <option key={service.id} value={service.name}>{service.name}</option>
                        ))}
                      </select>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-[#1a2545] mb-2">Message</label>
                      <textarea
                        name="message"
                        value={quoteForm.message}
                        onChange={handleQuoteFormChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] focus:ring-2 focus:ring-[#c93a3a]/20 resize-none transition"
                      />
                    </motion.div>
                  </div>
                  <motion.div 
                    className="mt-8 flex gap-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setShowQuoteModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition font-semibold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isSubmittingQuote}
                      className="flex-1 bg-[#c93a3a] text-white py-3 px-6 rounded-lg hover:bg-[#a83030] transition font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSubmittingQuote ? 1 : 1.02, boxShadow: "0 10px 20px rgba(201, 58, 58, 0.3)" }}
                      whileTap={{ scale: isSubmittingQuote ? 1 : 0.98 }}
                    >
                      {isSubmittingQuote ? 'Submitting...' : 'Submit Quote Request'}
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal - Glass Style */}
      <AnimatePresence>
        {showSearchModal && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSearchModal(false)}
          >
            <motion.div
              className="glass-light rounded-3xl max-w-2xl w-full shadow-float-lg border border-white/20"
              initial={{ scale: 0.8, y: -50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gradient-overlay-navy text-white p-8 rounded-t-3xl border-b border-white/10">
                <h2 className="text-3xl font-bold">Search</h2>
                <p className="text-white/80 mt-2">Enter your search query</p>
              </div>
              <div className="p-8">
                <form onSubmit={handleSearchFormSubmit}>
                  <div className="space-y-6">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-semibold text-[#1a2545] mb-2">Search Query *</label>
                      <input
                        type="text"
                        name="searchQuery"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        required
                        className="w-full px-4 py-3 bg-[#f5f1e8] border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] focus:ring-2 focus:ring-[#c93a3a]/20 transition"
                      />
                    </motion.div>
                  </div>
                  <motion.div 
                    className="mt-8 flex gap-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setShowSearchModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition font-semibold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 bg-[#c93a3a] text-white py-3 px-6 rounded-lg hover:bg-[#a83030] transition font-semibold shadow-lg"
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(201, 58, 58, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Submit Search
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}