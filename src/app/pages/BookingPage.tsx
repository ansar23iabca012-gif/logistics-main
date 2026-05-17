import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Truck,
  MapPin,
  FileText,
  IndianRupee,
  ArrowRight,
  Home,
  Package,
  Phone,
  Mail,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { getQuoteByToken, createBooking, markQuoteAsBooked } from '../../lib/supabaseService';
import { QuoteRequest } from '../../lib/supabase';
import { handleFormError } from '../../utils/errorHandler';

type Step = 'loading' | 'invalid' | 'already_booked' | 'form' | 'success';

function generateBookingNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `ASZE${year}${month}${rand}`;
}

// ── Field component ──────────────────────────────────────────────────────────
function Field({
  label, name, value, onChange, placeholder, required = false, type = 'text', maxLength,
}: {
  label: string; name: string; value: string; onChange: (e: any) => void;
  placeholder?: string; required?: boolean; type?: string; maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-[#c93a3a]">*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required} maxLength={maxLength}
        min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c93a3a]/20 focus:border-[#c93a3a] transition bg-white placeholder:text-gray-300"
      />
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <h2 className="font-bold text-[#1a2545] text-sm">{label}</h2>
    </div>
  );
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [step, setStep] = useState<Step>('loading');
  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingNumber, setBookingNumber] = useState('');

  const [form, setForm] = useState({
    pickup_address: '', pickup_city: '', pickup_state: '', pickup_pincode: '',
    delivery_address: '', delivery_city: '', delivery_state: '', delivery_pincode: '',
    pickup_date: '', items_description: '', special_instructions: '',
  });

  useEffect(() => {
    if (!token) { setStep('invalid'); return; }
    loadQuote(token);
  }, [token]);

  const loadQuote = async (t: string) => {
    const data = await getQuoteByToken(t);
    if (!data) { setStep('invalid'); return; }
    if (data.status === 'booked') { setStep('already_booked'); return; }
    if (data.status !== 'quoted') { setStep('invalid'); return; }
    setQuote(data);
    setForm(prev => ({
      ...prev,
      pickup_city: data.moving_from || '',
      delivery_city: data.moving_to || '',
      pickup_date: data.moving_date || '',
    }));
    setStep('form');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote?.id) return;
    setSubmitting(true);
    try {
      const bn = generateBookingNumber();
      const booking = await createBooking({
        booking_number: bn,
        service_type: quote.service_type,
        ...form,
        price_estimate: quote.quoted_price,
        final_price: quote.quoted_price,
        status: 'pending',
        payment_status: 'pending',
        quote_request_id: quote.id,
      });
      if (!booking) throw new Error('Failed to create booking');
      await markQuoteAsBooked(quote.id);
      setBookingNumber(bn);
      setStep('success');
    } catch (err: any) {
      handleFormError(err, 'booking', form);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#c93a3a] mx-auto" />
          <p className="text-gray-500 text-sm">Loading your quote...</p>
        </div>
      </div>
    );
  }

  // ── Invalid ──────────────────────────────────────────────────────────────────
  if (step === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-sm w-full text-center"
        >
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-[#1a2545] mb-2">Invalid Link</h2>
          <p className="text-gray-400 text-sm mb-6">This booking link is invalid or has expired. Please contact us for a new quote.</p>
          <button onClick={() => navigate('/')} className="bg-[#c93a3a] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#a83030] transition">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Already booked ───────────────────────────────────────────────────────────
  if (step === 'already_booked') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-sm w-full text-center"
        >
          <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-[#1a2545] mb-2">Already Booked</h2>
          <p className="text-gray-400 text-sm mb-6">This quote has already been confirmed as a booking. Contact us if you need changes.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/')} className="flex-1 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition">
              Home
            </button>
            <button onClick={() => navigate('/contact')} className="flex-1 bg-[#1a2545] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#2a3555] transition">
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── SUCCESS — Confirmation Page ───────────────────────────────────────────────
  // FIX 2: Full confirmation/thank-you page after booking
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 200 }}
          className="w-full max-w-lg"
        >
          {/* Top success card */}
          <div className="bg-[#1a2545] rounded-3xl p-8 text-center mb-4 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', damping: 14 }}
              className="w-16 h-16 bg-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5 relative z-10"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-1 relative z-10">Booking Confirmed!</h1>
            <p className="text-white/60 text-sm relative z-10">Your relocation has been successfully booked</p>

            <div className="mt-6 bg-white/10 rounded-2xl p-4 relative z-10">
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wide">Booking Number</p>
              <p className="text-2xl font-bold text-white tracking-wider font-mono">{bookingNumber}</p>
              <p className="text-white/40 text-xs mt-1">Save this for tracking</p>
            </div>
          </div>

          {/* Details card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Booking Summary</h2>
            <div className="space-y-3">
              {[
                { label: 'Service', value: quote?.service_type },
                { label: 'Confirmed Price', value: `₹${quote?.quoted_price?.toLocaleString('en-IN')}`, highlight: true },
                { label: 'Status', value: 'Pending Confirmation', badge: true },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-400">{row.label}</span>
                  {row.badge ? (
                    <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full">
                      {row.value}
                    </span>
                  ) : (
                    <span className={`text-sm font-bold ${row.highlight ? 'text-emerald-600' : 'text-[#1a2545]'}`}>
                      {row.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-4">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3">What happens next?</p>
            <div className="space-y-2.5">
              {[
                'Our team will review your booking within 24 hours',
                'You\'ll receive a confirmation call or email with pickup details',
                'Payment will be collected before or on moving day',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-800">{i + 1}</span>
                  </div>
                  <p className="text-xs text-amber-800">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/tracking')}
              className="flex items-center justify-center gap-2 bg-[#c93a3a] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#a83030] transition"
            >
              <Package className="w-4 h-4" /> Track Booking
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-[#1a2545] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#2a3555] transition"
            >
              <Home className="w-4 h-4" /> Go Home
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Questions? Call us at <strong className="text-gray-600">+91 620 057 3418</strong>
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Booking Form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-7">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="w-9 h-9 bg-[#1a2545] rounded-xl flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a2545]">Complete Your Booking</h1>
          </div>
          <p className="text-gray-400 text-sm">Confirm your details below to lock in your move</p>
        </div>

        {/* Quote summary pill */}
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a2545] rounded-2xl p-5 mb-5 text-white"
          >
            <p className="text-white/50 text-xs uppercase tracking-wide mb-3">Your Approved Quote</p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-bold">{quote.name}</p>
                <p className="text-white/60 text-sm">{quote.service_type}</p>
                {quote.moving_from && (
                  <p className="text-white/50 text-xs mt-1">{quote.moving_from} → {quote.moving_to}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs">Approved Price</p>
                <p className="text-3xl font-bold text-[#e8b647]">
                  ₹{quote.quoted_price?.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            {quote.admin_notes && (
              <p className="text-white/40 text-xs mt-3 border-t border-white/10 pt-3">
                📝 {quote.admin_notes}
              </p>
            )}
          </motion.div>
        )}

        {/* Form card */}
        <motion.form
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Pickup */}
          <div className="p-6 border-b border-gray-50">
            <SectionHeader icon={MapPin} label="Pickup Address" color="bg-emerald-100 text-emerald-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Street Address" name="pickup_address" value={form.pickup_address} onChange={handleChange} placeholder="House/Flat No., Street, Area" required />
              </div>
              <Field label="City" name="pickup_city" value={form.pickup_city} onChange={handleChange} placeholder="e.g. Mumbai" required />
              <Field label="State" name="pickup_state" value={form.pickup_state} onChange={handleChange} placeholder="e.g. Maharashtra" required />
              <Field label="Pincode" name="pickup_pincode" value={form.pickup_pincode} onChange={handleChange} placeholder="e.g. 400001" required maxLength={6} />
              <Field label="Pickup Date" name="pickup_date" value={form.pickup_date} onChange={handleChange} required type="date" />
            </div>
          </div>

          {/* Delivery */}
          <div className="p-6 border-b border-gray-50">
            <SectionHeader icon={MapPin} label="Delivery Address" color="bg-red-100 text-[#c93a3a]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Street Address" name="delivery_address" value={form.delivery_address} onChange={handleChange} placeholder="House/Flat No., Street, Area" required />
              </div>
              <Field label="City" name="delivery_city" value={form.delivery_city} onChange={handleChange} placeholder="e.g. Delhi" required />
              <Field label="State" name="delivery_state" value={form.delivery_state} onChange={handleChange} placeholder="e.g. Delhi" required />
              <Field label="Pincode" name="delivery_pincode" value={form.delivery_pincode} onChange={handleChange} placeholder="e.g. 110001" required maxLength={6} />
            </div>
          </div>

          {/* Extra details */}
          <div className="p-6 border-b border-gray-50">
            <SectionHeader icon={FileText} label="Additional Details" color="bg-sky-100 text-sky-600" />
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Items / Goods Description</label>
                <textarea
                  name="items_description" value={form.items_description} onChange={handleChange} rows={3}
                  placeholder="e.g. 2-BHK household items including sofa, beds, refrigerator..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c93a3a]/20 focus:border-[#c93a3a] transition resize-none placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Special Instructions</label>
                <textarea
                  name="special_instructions" value={form.special_instructions} onChange={handleChange} rows={2}
                  placeholder="e.g. Fragile items, access restrictions, floor number..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c93a3a]/20 focus:border-[#c93a3a] transition resize-none placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Footer / submit */}
          <div className="p-6 bg-gray-50/50">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Amount</p>
                <p className="text-3xl font-bold text-[#1a2545]">
                  ₹{quote?.quoted_price?.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Payment terms shared upon confirmation</p>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p className="font-semibold text-[#1a2545] text-sm">{quote?.service_type}</p>
                <p className="mt-0.5">Awaiting confirmation</p>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#c93a3a] text-white py-4 rounded-xl font-bold text-base hover:bg-[#a83030] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
              whileHover={{ scale: submitting ? 1 : 1.01 }}
              whileTap={{ scale: submitting ? 1 : 0.99 }}
            >
              {submitting ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> Confirming...</>
              ) : (
                <><CheckCircle className="w-5 h-5" /> Confirm Booking <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>

            <p className="text-xs text-gray-400 text-center mt-3">
              By confirming, you agree to ASZE Relocation's terms. Our team contacts you within 24 hours.
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}