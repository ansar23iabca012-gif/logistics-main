import { supabase } from './supabase';
import type { Booking, Payment, Review, User, Customer, Driver, LiveTracking, Notification, QuoteRequest } from './supabase';

/**
 * Supabase Service Layer
 * Provides CRUD operations for all database entities
 * All data is stored exclusively in Supabase Cloud Database
 */

// ============================================
// USER OPERATIONS
// ============================================

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data || [];
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      customers(*)
    `)
    .eq('role', 'customer')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }

  return data || [];
}

export async function getDrivers(): Promise<Driver[]> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      drivers(*)
    `)
    .eq('role', 'driver')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }

  return data || [];
}

export async function getAvailableDrivers(): Promise<Driver[]> {
  const { data, error } = await supabase
    .from('drivers')
    .select(`
      *,
      users(*)
    `)
    .eq('is_available', true);

  if (error) {
    console.error('Error fetching available drivers:', error);
    return [];
  }

  return data || [];
}

// ============================================
// QUOTE REQUEST OPERATIONS
// ============================================

export async function getAllQuoteRequests(): Promise<QuoteRequest[]> {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quote requests:', error);
    return [];
  }

  return data || [];
}

export async function getAllBookingsFromDB() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  return data ?? [];
}

export async function getQuoteByToken(token: string): Promise<QuoteRequest | null> {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('quote_token', token)
    .single();

  if (error) {
    console.error('Error fetching quote by token:', error);
    return null;
  }

  return data;
}

/**
 * Admin sends a price quote to the user.
 * Generates a unique token, saves the price + status, and returns the
 * booking URL so the admin can copy it (or it can be emailed).
 */
export async function sendQuoteToUser(
  quoteId: string,
  quotedPrice: number,
  adminNotes?: string
): Promise<{ bookingUrl: string; token: string } | null> {
  // Generate a unique token  
  const token = `QT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const baseUrl = window.location.origin;
  const bookingUrl = `${baseUrl}/booking?token=${token}`;

  const { error } = await supabase
    .from('quote_requests')
    .update({
      status: 'quoted',
      quoted_price: quotedPrice,
      quote_token: token,
      admin_notes: adminNotes || null,
      quoted_at: new Date().toISOString(),
    })
    .eq('id', quoteId);

  if (error) {
    console.error('Error updating quote with price:', error);
    return null;
  }

  return { bookingUrl, token };
}

export async function markQuoteAsBooked(quoteId: string): Promise<boolean> {
  const { error } = await supabase
    .from('quote_requests')
    .update({ status: 'booked' })
    .eq('id', quoteId);

  if (error) {
    console.error('Error marking quote as booked:', error);
    return false;
  }

  return true;
}

// ============================================
// BOOKING OPERATIONS
// ============================================

export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data || [];
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error) {
    console.error('Error fetching booking:', error);
    return null;
  }

  return data;
}

export async function getBookingByNumber(bookingNumber: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_number', bookingNumber)
    .single();

  if (error) {
    console.error('Error fetching booking:', error);
    return null;
  }

  return data;
}

export async function getCustomerBookings(customerId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customer bookings:', error);
    return [];
  }

  return data || [];
}

export async function getDriverBookings(driverId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching driver bookings:', error);
    return [];
  }

  return data || [];
}

export async function createBooking(booking: Partial<Booking>): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }

  return data;
}

export async function updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    return null;
  }

  return data;
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking['status']
): Promise<Booking | null> {
  return updateBooking(bookingId, { status });
}

export async function assignDriverToBooking(
  bookingId: string,
  driverId: string,
  vehicleNumber: string
): Promise<Booking | null> {
  return updateBooking(bookingId, {
    driver_id: driverId,
    vehicle_number: vehicleNumber,
    status: 'assigned'
  });
}

// ============================================
// PAYMENT OPERATIONS
// ============================================

export async function getAllPayments(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }

  return data || [];
}

export async function getBookingPayments(bookingId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching booking payments:', error);
    return [];
  }

  return data || [];
}

export async function createPayment(payment: Partial<Payment>): Promise<Payment | null> {
  const { data, error } = await supabase
    .from('payments')
    .insert(payment)
    .select()
    .single();

  if (error) {
    console.error('Error creating payment:', error);
    return null;
  }

  return data;
}

export async function updatePaymentStatus(
  paymentId: string,
  status: Payment['payment_status']
): Promise<Payment | null> {
  const { data, error } = await supabase
    .from('payments')
    .update({ payment_status: status })
    .eq('id', paymentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment status:', error);
    return null;
  }

  return data;
}

// ============================================
// REVIEW OPERATIONS
// ============================================

export async function getAllReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

export async function getApprovedReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching approved reviews:', error);
    return [];
  }

  return data || [];
}

export async function getFeaturedReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_featured', true)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured reviews:', error);
    return [];
  }

  return data || [];
}

export async function createReview(review: Partial<Review>): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    return null;
  }

  return data;
}

export async function updateReviewStatus(
  reviewId: string,
  status: Review['status']
): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error updating review status:', error);
    return null;
  }

  return data;
}

// ============================================
// LIVE TRACKING OPERATIONS
// ============================================

export async function getLiveTracking(bookingId: string): Promise<LiveTracking | null> {
  const { data, error } = await supabase
    .from('live_tracking')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (error) {
    console.error('Error fetching live tracking:', error);
    return null;
  }

  return data;
}

export async function updateLiveTracking(
  bookingId: string,
  trackingData: Partial<LiveTracking>
): Promise<LiveTracking | null> {
  const { data, error } = await supabase
    .from('live_tracking')
    .update({ ...trackingData, last_updated: new Date().toISOString() })
    .eq('booking_id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating live tracking:', error);
    return null;
  }

  return data;
}

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data || [];
}

export async function createNotification(notification: Partial<Notification>): Promise<Notification | null> {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }

  return data;
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }

  return true;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function isSupabaseEnabled(): boolean {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}