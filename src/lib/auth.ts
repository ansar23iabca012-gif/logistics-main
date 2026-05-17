import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'admin' | 'customer' | 'driver';
  status: string;
  profile_image?: string;
  // Customer specific
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  // Driver specific
  license_number?: string;
  vehicle_number?: string;
  vehicle_type?: string;
  is_available?: boolean;
  rating?: number;
  total_deliveries?: number;
  total_earnings?: number;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
  token?: string;
}

/**
 * Login function with Supabase authentication
 * Uses localStorage to cache session data for persistence
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    console.log('🔑 Auth: Attempting Supabase sign in for:', email);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('❌ Auth error from Supabase:', authError);
      return {
        success: false,
        message: authError.message || 'Invalid email or password'
      };
    }

    if (!authData.user) {
      console.error('❌ No user data returned from Supabase');
      return {
        success: false,
        message: 'Login failed'
      };
    }

    console.log('✅ Supabase auth successful, user ID:', authData.user.id);
    console.log('📊 Fetching user data from users table...');

    // Get user details from public.users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        customers(*),
        drivers(*)
      `)
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('❌ Error fetching user data:', userError);
      return {
        success: false,
        message: 'User data not found: ' + userError.message
      };
    }

    if (!userData) {
      console.error('❌ No user data found in users table for ID:', authData.user.id);
      return {
        success: false,
        message: 'User profile not found. Please contact support.'
      };
    }

    console.log('✅ User data found:', {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      status: userData.status
    });

    if (userData.status !== 'active') {
      console.error('❌ User account is not active. Status:', userData.status);
      return {
        success: false,
        message: 'Account is inactive or suspended'
      };
    }

    const authUser: AuthUser = {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      phone: userData.phone,
      role: userData.role,
      status: userData.status,
      profile_image: userData.profile_image,
      // Customer fields
      address: userData.customers?.[0]?.address,
      city: userData.customers?.[0]?.city,
      state: userData.customers?.[0]?.state,
      pincode: userData.customers?.[0]?.pincode,
      // Driver fields
      license_number: userData.drivers?.[0]?.license_number,
      vehicle_number: userData.drivers?.[0]?.vehicle_number,
      vehicle_type: userData.drivers?.[0]?.vehicle_type,
      is_available: userData.drivers?.[0]?.is_available,
      rating: userData.drivers?.[0]?.rating,
      total_deliveries: userData.drivers?.[0]?.total_deliveries,
      total_earnings: userData.drivers?.[0]?.total_earnings
    };

    // Cache auth data in localStorage for persistence
    console.log('💾 Storing auth data in localStorage...');
    localStorage.setItem('authUser', JSON.stringify(authUser));
    localStorage.setItem('authToken', authData.session?.access_token || '');
    localStorage.setItem('supabaseSession', JSON.stringify(authData.session));

    console.log('✅ Login successful! User role:', authUser.role);

    return {
      success: true,
      user: authUser,
      token: authData.session?.access_token,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('❌ Unexpected login error:', error);
    return {
      success: false,
      message: 'An error occurred during login. Check console for details.'
    };
  }
}

/**
 * Register function (for customers) with Supabase authentication
 * Uses localStorage to cache session data for persistence
 */
export async function register(userData: {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}): Promise<AuthResponse> {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
          phone: userData.phone
        }
      }
    });

    if (authError) {
      return {
        success: false,
        message: authError.message || 'Registration failed'
      };
    }

    if (!authData.user) {
      return {
        success: false,
        message: 'Registration failed'
      };
    }

    // Create user in public.users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        full_name: userData.full_name,
        phone: userData.phone,
        role: 'customer',
        status: 'active',
        profile_image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      });

    if (userError) {
      return {
        success: false,
        message: 'Failed to create user profile'
      };
    }

    // Create customer record
    const { error: customerError } = await supabase
      .from('customers')
      .insert({
        id: authData.user.id,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        pincode: userData.pincode,
        total_bookings: 0,
        total_spent: 0
      });

    if (customerError) {
      return {
        success: false,
        message: 'Failed to create customer profile'
      };
    }

    const authUser: AuthUser = {
      id: authData.user.id,
      email: userData.email,
      full_name: userData.full_name,
      phone: userData.phone,
      role: 'customer',
      status: 'active',
      profile_image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      address: userData.address,
      city: userData.city,
      state: userData.state,
      pincode: userData.pincode
    };

    // Cache auth data in localStorage for persistence
    localStorage.setItem('authUser', JSON.stringify(authUser));
    localStorage.setItem('authToken', authData.session?.access_token || '');
    localStorage.setItem('supabaseSession', JSON.stringify(authData.session));

    return {
      success: true,
      user: authUser,
      token: authData.session?.access_token,
      message: 'Registration successful! Please check your email to verify your account.'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'An error occurred during registration'
    };
  }
}

/**
 * Logout function with Supabase
 * Clears both Supabase session and localStorage cache
 */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();

  localStorage.removeItem('authUser');
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminAuth');
  localStorage.removeItem('supabaseSession');
}

/**
 * Get current user from localStorage cache
 */
export function getCurrentUser(): AuthUser | null {
  const userStr = localStorage.getItem('authUser');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken');
}

/**
 * Check user role
 */
export function hasRole(role: 'admin' | 'customer' | 'driver'): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

/**
 * Get auth token from localStorage cache
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}
