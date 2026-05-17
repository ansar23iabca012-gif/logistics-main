import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wjkceccwfkfevdbijvkh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqa2NlY2N3ZmtmZXZkYmlqdmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NDM5NDksImV4cCI6MjA5MzAxOTk0OX0.7-Wl5hglwCi6thpabb2l_n48nnbG98-AFmcIvCu9_pA';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── FIX: Restore Supabase session from localStorage on every page load ───────
// The Supabase JS client loses its in-memory session on refresh.
// We manually re-hydrate it from the session we stored during login,
// so all queries go out as "authenticated" instead of "anon".
const storedSession = localStorage.getItem('supabaseSession');
if (storedSession) {
  try {
    const session = JSON.parse(storedSession);
    if (session?.access_token && session?.refresh_token) {
      supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
    }
  } catch (e) {
    console.warn('Failed to restore Supabase session:', e);
    localStorage.removeItem('supabaseSession');
  }
}

export const checkSupabaseConfig = () => true;

// Types for database tables
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at?: string;
}

export interface QuoteRequest {
  id?: string;
  service_type: string;
  name: string;
  email: string;
  phone: string;
  moving_from?: string;
  moving_to?: string;
  moving_date?: string;
  branch?: string;
  additional_details?: string;
  // --- NEW FIELDS for quote flow ---
  status?: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'booked';
  quoted_price?: number;
  quote_token?: string; // unique token used in the booking link
  admin_notes?: string;
  quoted_at?: string;
  created_at?: string;
}

export interface Shipment {
  id?: string;
  tracking_number: string;
  customer_name: string;
  origin: string;
  destination: string;
  service_type: string;
  current_status: string;
  current_location: string;
  estimated_delivery?: string;
  created_at?: string;
}

export interface ShipmentUpdate {
  id?: string;
  shipment_id: string;
  date: string;
  time: string;
  status: string;
  location: string;
  completed: boolean;
  created_at?: string;
}

// User and Authentication Types
export interface User {
  id?: string;
  email: string;
  password?: string;
  full_name: string;
  phone: string;
  role: 'admin' | 'customer' | 'driver';
  status: 'active' | 'inactive' | 'suspended';
  profile_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer extends User {
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  total_bookings?: number;
  total_spent?: number;
}

export interface Driver extends User {
  license_number: string;
  vehicle_number: string;
  vehicle_type: string;
  current_location?: string;
  is_available: boolean;
  rating?: number;
  total_deliveries?: number;
  total_earnings?: number;
  joining_date?: string;
}

// Booking and Order Types
export interface Booking {
  id?: string;
  booking_number: string;
  customer_id: string;
  service_type: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_pincode: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_pincode: string;
  pickup_date: string;
  delivery_date?: string;
  estimated_delivery?: string;
  status: 'pending' | 'confirmed' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  driver_id?: string;
  vehicle_number?: string;
  distance_km?: number;
  weight_kg?: number;
  items_description?: string;
  special_instructions?: string;
  price_estimate?: number;
  final_price?: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  quote_request_id?: string; // link back to originating quote
  created_at?: string;
  updated_at?: string;
}

// Payment Types
export interface Payment {
  id?: string;
  payment_id: string;
  booking_id: string;
  customer_id: string;
  amount: number;
  payment_method: 'razorpay' | 'stripe' | 'paypal' | 'cash' | 'bank_transfer';
  payment_type: 'advance' | 'full' | 'refund';
  transaction_id?: string;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_date?: string;
  gateway_response?: any;
  invoice_number?: string;
  created_at?: string;
}

export interface Invoice {
  id?: string;
  invoice_number: string;
  booking_id: string;
  customer_id: string;
  invoice_date: string;
  due_date?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  created_at?: string;
}

// GPS Tracking Types
export interface LiveTracking {
  id?: string;
  booking_id: string;
  driver_id: string;
  current_lat: number;
  current_lng: number;
  speed_kmh?: number;
  heading?: number;
  last_updated: string;
  battery_level?: number;
  is_tracking_active: boolean;
}

export interface RoutePoint {
  id?: string;
  booking_id: string;
  lat: number;
  lng: number;
  timestamp: string;
  status?: string;
}

export interface TrackingHistory {
  id?: string;
  booking_id: string;
  location: string;
  lat?: number;
  lng?: number;
  status: string;
  description?: string;
  timestamp: string;
  created_at?: string;
}

// Review and Feedback Types
export interface Review {
  id?: string;
  booking_id: string;
  customer_id: string;
  driver_id?: string;
  rating: number;
  service_rating?: number;
  driver_rating?: number;
  delivery_rating?: number;
  title?: string;
  comment?: string;
  review_type: 'service' | 'driver' | 'overall';
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Complaint {
  id?: string;
  complaint_number: string;
  booking_id?: string;
  customer_id: string;
  category: 'service' | 'driver' | 'payment' | 'damage' | 'delay' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  resolution?: string;
  resolved_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Analytics and Notifications
export interface Notification {
  id?: string;
  user_id: string;
  user_role: 'admin' | 'customer' | 'driver';
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'tracking' | 'general' | 'alert';
  is_read: boolean;
  action_url?: string;
  created_at?: string;
}

export interface Analytics {
  id?: string;
  date: string;
  total_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  revenue: number;
  active_drivers: number;
  active_customers: number;
  average_rating: number;
  created_at?: string;
}