import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { logout, isAuthenticated } from '../../lib/auth';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut,
  Mail,
  FileText,
  Package,
  Search,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle,
  Bell,
  MapPin,
  Shield,
  Send,
  Copy,
  IndianRupee,
  ClipboardList,
  Check,
  ChevronRight,
  TrendingUp,
  Users,
  BarChart2,
  Inbox,
  Phone,
  User,
} from 'lucide-react';
import { supabase, checkSupabaseConfig, ContactSubmission, QuoteRequest } from '../../lib/supabase';
import { getAllQuoteRequests, sendQuoteToUser, getAllBookingsFromDB } from '../../lib/supabaseService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusColor(status?: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    quoted: 'bg-sky-100 text-sky-700 border-sky-200',
    accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    booked: 'bg-violet-100 text-violet-700 border-violet-200',
  };
  return map[status || 'pending'] || 'bg-gray-100 text-gray-600 border-gray-200';
}

function bookingStatusColor(status?: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-sky-100 text-sky-700',
    assigned: 'bg-blue-100 text-blue-700',
    in_transit: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return map[status ?? ''] || 'bg-gray-100 text-gray-600';
}

// ─── Send Quote Modal ─────────────────────────────────────────────────────────

interface SendQuoteModalProps {
  quote: QuoteRequest;
  onClose: () => void;
  onSent: () => void;
}

function SendQuoteModal({ quote, onClose, onSent }: SendQuoteModalProps) {
  const [price, setPrice] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ bookingUrl: string; token: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSend = async () => {
    const priceNum = parseFloat(price);
    if (!priceNum || priceNum <= 0) { alert('Please enter a valid price'); return; }
    setLoading(true);
    const res = await sendQuoteToUser(quote.id!, priceNum, adminNotes);
    setLoading(false);
    if (res) setResult(res);
    else alert('Failed to save quote. Please try again.');
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGmailOpen = () => {
    if (!result) return;
    const to = encodeURIComponent(quote.email);
    const subject = encodeURIComponent(`Your ASZE Relocation Quote – ₹${parseFloat(price).toLocaleString('en-IN')}`);
    const body = encodeURIComponent(
      `Dear ${quote.name},

Thank you for requesting a quote with ASZE Relocation!

Service: ${quote.service_type}
Quoted Price: ₹${parseFloat(price).toLocaleString('en-IN')}
${adminNotes ? `Notes: ${adminNotes}` : ''}

To confirm your booking, please click the link below:
${result.bookingUrl}

This link is unique to your quote. Once you submit the booking form, our team will confirm your relocation details.

Warm regards,
ASZE Relocation Team
📞 (+91) 620 057 3418 | 1800 170 6200
✉️ info@aszerelocation.com`
    );
    window.open(`https://mail.google.com/mail/?view=cm&to=${to}&su=${subject}&body=${body}`, '_blank');
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        initial={{ scale: 0.92, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 24, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a2545] text-white px-6 py-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <IndianRupee className="w-4 h-4" /> Send Quote to Customer
          </h2>
          <p className="text-white/60 text-sm mt-0.5">{quote.name} · {quote.service_type}</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Customer summary */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm space-y-1 border border-gray-100">
            <p className="text-gray-500">✉️ {quote.email}</p>
            <p className="text-gray-500">📞 {quote.phone}</p>
            {quote.moving_from && <p className="text-gray-500">📍 {quote.moving_from} → {quote.moving_to || '?'}</p>}
          </div>

          {!result ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quoted Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. 45000"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c93a3a]/30 focus:border-[#c93a3a] text-lg font-bold transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Notes for Customer <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Price includes packing materials and insurance..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c93a3a]/30 focus:border-[#c93a3a] resize-none text-sm transition"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={loading || !price}
                  className="flex-1 px-4 py-2.5 bg-[#1a2545] text-white rounded-xl text-sm font-semibold hover:bg-[#2a3555] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? 'Generating...' : 'Generate Link'}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                <p className="font-bold text-emerald-800 text-sm">Quote saved!</p>
                <p className="text-emerald-600 text-xs mt-0.5">₹{parseFloat(price).toLocaleString('en-IN')} for {quote.name}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Booking Link</label>
                <div className="flex gap-2">
                  <input
                    readOnly value={result.bookingUrl}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600 truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className={`shrink-0 px-3 py-2 border rounded-lg transition text-sm ${copied ? 'border-emerald-300 text-emerald-600 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleGmailOpen}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#c93a3a] text-white rounded-xl font-semibold text-sm hover:bg-[#a83030] transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" fill="white" fillOpacity="0.2" />
                    <path d="M22 6L12 13 2 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Open in Gmail
                </button>
                <button
                  onClick={() => { onSent(); onClose(); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Check className="w-4 h-4" /> Done
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Opens Gmail to send to <strong>{quote.email}</strong>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'overview' | 'quotes' | 'bookings';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteSearch, setQuoteSearch] = useState('');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/admin/login'); return; }
    fetchData();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  // ✅ FIXED: both quotes AND bookings now fetched from Supabase in parallel
  const fetchData = async () => {
    setLoading(true);
    try {
      if (checkSupabaseConfig()) {
        const [quoteData, bookingData] = await Promise.all([
          getAllQuoteRequests(),
          getAllBookingsFromDB(),
        ]);
        setQuotes(quoteData);
        setBookings(bookingData);
      }
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => { await logout(); navigate('/admin/login'); };

  const pendingQuotes = quotes.filter(q => q.status === 'pending').length;

  const filteredQuotes = quotes.filter(q => {
    const s = quoteSearch.toLowerCase();
    const matchSearch = !s || q.name.toLowerCase().includes(s) || q.email.toLowerCase().includes(s) || q.service_type.toLowerCase().includes(s);
    const matchStatus = quoteStatusFilter === 'all' || q.status === quoteStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredBookings = bookings.filter(b => {
    const s = bookingSearch.toLowerCase();
    if (!s) return true;
    // ✅ Also search by customer name/email from the joined customers table
    const customerName = b.users?.name?.toLowerCase() ?? '';
    const customerEmail = b.users?.email?.toLowerCase() ?? '';
    return (
      b.booking_number?.toLowerCase().includes(s) ||
      b.pickup_city?.toLowerCase().includes(s) ||
      b.delivery_city?.toLowerCase().includes(s) ||
      customerName.includes(s) ||
      customerEmail.includes(s)
    );
  });

  const stats = {
    totalQuotes: quotes.length,
    pendingQuotes,
    bookedQuotes: quotes.filter(q => q.status === 'booked').length,
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => ['pending', 'confirmed', 'assigned', 'in_transit'].includes(b.status)).length,
    completedBookings: bookings.filter(b => b.status === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#c93a3a] mx-auto" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Sidebar ── */}
      <div className="fixed inset-y-0 left-0 w-56 bg-[#1a2545] flex flex-col z-30">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#c93a3a] rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">ASZE Admin</p>
              <p className="text-white/40 text-xs mt-0.5">Management Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {([
            { id: 'overview', label: 'Overview', icon: BarChart2 },
            { id: 'quotes', label: 'Quotes', icon: ClipboardList, badge: pendingQuotes },
            { id: 'bookings', label: 'Bookings', icon: Package },
          ] as { id: Tab; label: string; icon: any; badge?: number }[]).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
            >
              <span className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4" />
                {item.label}
              </span>
              {item.badge ? (
                <span className="bg-[#c93a3a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-white/50 hover:text-white/80 rounded-lg text-sm transition"
          >
            <MapPin className="w-4 h-4" /> View Site
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-white/50 hover:text-red-400 rounded-lg text-sm transition"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="ml-56 min-h-screen flex flex-col">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-gray-900 font-bold text-lg capitalize">{activeTab}</h1>
            <p className="text-gray-400 text-xs mt-0.5">
              {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {pendingQuotes > 0 && activeTab !== 'quotes' && (
              <button
                onClick={() => setActiveTab('quotes')}
                className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-amber-100 transition"
              >
                <Bell className="w-3.5 h-3.5" />
                {pendingQuotes} pending quote{pendingQuotes > 1 ? 's' : ''}
              </button>
            )}
            <button
              onClick={fetchData}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 px-8 py-7">
          <AnimatePresence mode="wait">

            {/* ══ OVERVIEW ══ */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="space-y-7"
              >
                {pendingQuotes > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Inbox className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-amber-800 font-semibold text-sm">
                          {pendingQuotes} quote request{pendingQuotes > 1 ? 's' : ''} waiting
                        </p>
                        <p className="text-amber-600 text-xs">Review and send pricing to customers</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('quotes')}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition"
                    >
                      Review <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total Quotes', value: stats.totalQuotes, sub: `${stats.pendingQuotes} pending`, icon: ClipboardList, accent: '#c93a3a', bg: 'bg-red-50' },
                    { label: 'Total Bookings', value: stats.totalBookings, sub: `${stats.activeBookings} active`, icon: Package, accent: '#1a2545', bg: 'bg-slate-50' },
                    {
                      label: 'Completed', value: stats.completedBookings,
                      sub: `${stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}% success rate`,
                      icon: CheckCircle, accent: '#16a34a', bg: 'bg-emerald-50',
                    },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
                    >
                      <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
                        <s.icon className="w-5 h-5" style={{ color: s.accent }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent quotes + bookings */}
                <div className="grid grid-cols-2 gap-5">
                  {/* Recent quotes */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                      <h2 className="text-sm font-bold text-gray-900">Recent Quotes</h2>
                      <button onClick={() => setActiveTab('quotes')} className="text-xs text-[#c93a3a] font-semibold hover:underline">See all</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {quotes.slice(0, 5).map((q, i) => (
                        <div key={q.id || i} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {q.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{q.name}</p>
                              <p className="text-xs text-gray-400 truncate">{q.service_type}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor(q.status)}`}>
                            {q.status || 'pending'}
                          </span>
                        </div>
                      ))}
                      {quotes.length === 0 && (
                        <p className="px-5 py-8 text-center text-gray-400 text-sm">No quotes yet</p>
                      )}
                    </div>
                  </div>

                  {/* Recent bookings — now from DB with customer info */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                      <h2 className="text-sm font-bold text-gray-900">Recent Bookings</h2>
                      <button onClick={() => setActiveTab('bookings')} className="text-xs text-[#c93a3a] font-semibold hover:underline">See all</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {bookings.slice(0, 5).map((b) => (
                        // ✅ Use b.id as key instead of array index
                        <div key={b.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{b.booking_number}</p>
                            {/* ✅ Show customer name from joined table */}
                            {b.users?.name && (
                              <p className="text-xs text-gray-500 truncate">{b.users.name}</p>
                            )}
                            <p className="text-xs text-gray-400 truncate">{b.pickup_city} → {b.delivery_city}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bookingStatusColor(b.status)}`}>
                            {b.status}
                          </span>
                        </div>
                      ))}
                      {bookings.length === 0 && (
                        <p className="px-5 py-8 text-center text-gray-400 text-sm">No bookings yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ QUOTES ══ */}
            {activeTab === 'quotes' && (
              <motion.div
                key="quotes"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search name, email, service..."
                      value={quoteSearch}
                      onChange={e => setQuoteSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c93a3a]/20 focus:border-[#c93a3a] transition bg-white"
                    />
                  </div>
                  <Select value={quoteStatusFilter} onValueChange={setQuoteStatusFilter}>
                    <SelectTrigger className="w-36 bg-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2 ml-auto">
                    {[
                      { label: 'All', val: 'all', count: quotes.length },
                      { label: 'Pending', val: 'pending', count: stats.pendingQuotes },
                      { label: 'Booked', val: 'booked', count: stats.bookedQuotes },
                    ].map(p => (
                      <button
                        key={p.val}
                        onClick={() => setQuoteStatusFilter(p.val)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${quoteStatusFilter === p.val ? 'bg-[#1a2545] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        {p.label} {p.count}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredQuotes.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                    <ClipboardList className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      {quotes.length === 0 ? 'Quote requests will appear here when submitted' : 'No quotes match your filters'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredQuotes.map((quote, idx) => (
                      <motion.div
                        key={quote.id || idx}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {quote.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-gray-900 text-sm">{quote.name}</p>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor(quote.status)}`}>
                                  {quote.status || 'pending'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{quote.email} · {quote.phone}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{quote.service_type}</span>
                                {quote.moving_from && (
                                  <span className="text-xs text-gray-500">📍 {quote.moving_from} → {quote.moving_to || '?'}</span>
                                )}
                                {quote.moving_date && (
                                  <span className="text-xs text-gray-500">📅 {new Date(quote.moving_date).toLocaleDateString('en-IN')}</span>
                                )}
                              </div>
                              {quote.additional_details && (
                                <p className="text-xs text-gray-400 mt-1.5 italic max-w-md">"{quote.additional_details}"</p>
                              )}
                              {quote.admin_notes && (
                                <p className="text-xs text-sky-600 mt-1">📝 {quote.admin_notes}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {quote.quoted_price && (
                              <p className="text-lg font-bold text-emerald-600">₹{quote.quoted_price.toLocaleString('en-IN')}</p>
                            )}
                            <p className="text-xs text-gray-400">
                              {quote.created_at ? new Date(quote.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                            </p>
                            {quote.status === 'pending' && (
                              <button
                                onClick={() => setSelectedQuote(quote)}
                                className="flex items-center gap-1.5 bg-[#c93a3a] hover:bg-[#a83030] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition"
                              >
                                <IndianRupee className="w-3.5 h-3.5" /> Send Price
                              </button>
                            )}
                            {quote.status === 'quoted' && (
                              <button
                                onClick={() => setSelectedQuote(quote)}
                                className="flex items-center gap-1.5 border border-sky-200 text-sky-600 hover:bg-sky-50 text-xs font-semibold px-3.5 py-2 rounded-lg transition"
                              >
                                <RefreshCw className="w-3 h-3" /> Resend
                              </button>
                            )}
                            {quote.status === 'booked' && (
                              <span className="flex items-center gap-1 text-violet-600 text-xs font-semibold">
                                <CheckCircle className="w-3.5 h-3.5" /> Booked
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ══ BOOKINGS ══ */}
            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search booking, customer, city..."
                      value={bookingSearch}
                      onChange={e => setBookingSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c93a3a]/20 focus:border-[#c93a3a] transition bg-white"
                    />
                  </div>
                  <p className="text-sm text-gray-400 ml-auto">{filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}</p>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                    <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No bookings found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBookings.map((b) => (
                      // ✅ Use b.id as key instead of array index
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-[#1a2545]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-gray-900 text-sm">{b.booking_number}</p>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bookingStatusColor(b.status)}`}>
                                  {b.status}
                                </span>
                              </div>

                              {/* ✅ Customer details from joined users table */}
                              {b.users && (
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                                  {b.users.name && (
                                    <span className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                                      <User className="w-3 h-3" /> {b.users.name}
                                    </span>
                                  )}
                                  {b.users.email && (
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                      <Mail className="w-3 h-3" /> {b.users.email}
                                    </span>
                                  )}
                                  {b.users.phone && (
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                      <Phone className="w-3 h-3" /> {b.users.phone}
                                    </span>
                                  )}
                                </div>
                              )}

                              <p className="text-xs text-gray-500 mt-1">{b.service_type}</p>
                              <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {b.pickup_city}
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-300" />
                                <span>{b.delivery_city}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right text-xs text-gray-400 flex-shrink-0">
                            <p className={`font-semibold text-sm ${b.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {b.payment_status || 'pending'}
                            </p>
                            {b.total_amount && (
                              <p className="font-bold text-gray-700 text-sm mt-0.5">
                                ₹{Number(b.total_amount).toLocaleString('en-IN')}
                              </p>
                            )}
                            <p className="mt-0.5">
                              {b.pickup_date
                                ? new Date(b.pickup_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                                : '—'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Send Quote Modal */}
      <AnimatePresence>
        {selectedQuote && (
          <SendQuoteModal
            quote={selectedQuote}
            onClose={() => setSelectedQuote(null)}
            onSent={() => { fetchData(); setSelectedQuote(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}