import { supabase } from './supabase';

// Comprehensive Dummy Data for ASZE RELOCATION Platform

export const dummyUsers = [
  // Admin Users
  {
    email: 'admin@aszerelocation.com',
    password: 'Admin@123',
    full_name: 'Amit Kumar',
    phone: '6200573418',
    role: 'admin',
    status: 'active',
    profile_image: 'https://i.pravatar.cc/150?img=12'
  },
  {
    email: 'manager@aszerelocation.com',
    password: 'Manager@123',
    full_name: 'Priya Sharma',
    phone: '9876543210',
    role: 'admin',
    status: 'active',
    profile_image: 'https://i.pravatar.cc/150?img=5'
  },

  // Customer Users
  {
    email: 'rajesh.verma@gmail.com',
    password: 'Customer@123',
    full_name: 'Rajesh Verma',
    phone: '9123456789',
    role: 'customer',
    status: 'active',
    address: '45, MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    profile_image: 'https://i.pravatar.cc/150?img=33'
  },
  {
    email: 'sneha.patel@gmail.com',
    password: 'Customer@123',
    full_name: 'Sneha Patel',
    phone: '9234567890',
    role: 'customer',
    status: 'active',
    address: '123, Nehru Place',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110019',
    profile_image: 'https://i.pravatar.cc/150?img=9'
  },
  {
    email: 'arun.kumar@yahoo.com',
    password: 'Customer@123',
    full_name: 'Arun Kumar',
    phone: '9345678901',
    role: 'customer',
    status: 'active',
    address: '78, Brigade Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    profile_image: 'https://i.pravatar.cc/150?img=15'
  },
  {
    email: 'ananya.singh@gmail.com',
    password: 'Customer@123',
    full_name: 'Ananya Singh',
    phone: '9456789012',
    role: 'customer',
    status: 'active',
    address: '56, Park Street',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700016',
    profile_image: 'https://i.pravatar.cc/150?img=23'
  },
  {
    email: 'vikram.reddy@gmail.com',
    password: 'Customer@123',
    full_name: 'Vikram Reddy',
    phone: '9567890123',
    role: 'customer',
    status: 'active',
    address: '34, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    profile_image: 'https://i.pravatar.cc/150?img=68'
  },

  // Driver Users
  {
    email: 'ramesh.driver@aszerelocation.com',
    password: 'Driver@123',
    full_name: 'Ramesh Yadav',
    phone: '9678901234',
    role: 'driver',
    status: 'active',
    license_number: 'MH0220200012345',
    vehicle_number: 'MH 02 AB 1234',
    vehicle_type: 'Truck - 14 Feet',
    current_location: 'Mumbai, Maharashtra',
    is_available: true,
    rating: 4.8,
    total_deliveries: 156,
    total_earnings: 425000,
    profile_image: 'https://i.pravatar.cc/150?img=60'
  },
  {
    email: 'sunil.driver@aszerelocation.com',
    password: 'Driver@123',
    full_name: 'Sunil Kumar',
    phone: '9789012345',
    role: 'driver',
    status: 'active',
    license_number: 'DL0520200023456',
    vehicle_number: 'DL 05 CD 5678',
    vehicle_type: 'Truck - 17 Feet',
    current_location: 'Delhi',
    is_available: true,
    rating: 4.6,
    total_deliveries: 142,
    total_earnings: 385000,
    profile_image: 'https://i.pravatar.cc/150?img=51'
  },
  {
    email: 'prakash.driver@aszerelocation.com',
    password: 'Driver@123',
    full_name: 'Prakash Naik',
    phone: '9890123456',
    role: 'driver',
    status: 'active',
    license_number: 'KA0320200034567',
    vehicle_number: 'KA 03 EF 9012',
    vehicle_type: 'Truck - 19 Feet',
    current_location: 'Bangalore, Karnataka',
    is_available: false,
    rating: 4.9,
    total_deliveries: 189,
    total_earnings: 512000,
    profile_image: 'https://i.pravatar.cc/150?img=52'
  },
  {
    email: 'manish.driver@aszerelocation.com',
    password: 'Driver@123',
    full_name: 'Manish Das',
    phone: '9901234567',
    role: 'driver',
    status: 'active',
    license_number: 'WB0220200045678',
    vehicle_number: 'WB 02 GH 3456',
    vehicle_type: 'Truck - 14 Feet',
    current_location: 'Kolkata, West Bengal',
    is_available: true,
    rating: 4.5,
    total_deliveries: 134,
    total_earnings: 356000,
    profile_image: 'https://i.pravatar.cc/150?img=53'
  },
  {
    email: 'ravi.driver@aszerelocation.com',
    password: 'Driver@123',
    full_name: 'Ravi Chandra',
    phone: '8812345678',
    role: 'driver',
    status: 'active',
    license_number: 'TS0920200056789',
    vehicle_number: 'TS 09 IJ 7890',
    vehicle_type: 'Truck - 17 Feet',
    current_location: 'Hyderabad, Telangana',
    is_available: true,
    rating: 4.7,
    total_deliveries: 167,
    total_earnings: 445000,
    profile_image: 'https://i.pravatar.cc/150?img=54'
  }
];

export const dummyBookings = [
  {
    booking_number: 'ASZE2026050001',
    customer_id: 'customer_1',
    service_type: 'Home Relocation',
    pickup_address: '45, MG Road, Colaba',
    pickup_city: 'Mumbai',
    pickup_state: 'Maharashtra',
    pickup_pincode: '400001',
    delivery_address: '78, Brigade Road, MG Road',
    delivery_city: 'Bangalore',
    delivery_state: 'Karnataka',
    delivery_pincode: '560001',
    pickup_date: '2026-05-15',
    delivery_date: '2026-05-17',
    estimated_delivery: '2026-05-17',
    status: 'in_transit',
    driver_id: 'driver_3',
    vehicle_number: 'KA 03 EF 9012',
    distance_km: 985,
    weight_kg: 1200,
    items_description: '3 BHK household items including furniture, appliances, and personal belongings',
    special_instructions: 'Handle glassware and electronics with extra care',
    price_estimate: 45000,
    final_price: 45000,
    payment_status: 'partial'
  },
  {
    booking_number: 'ASZE2026050002',
    customer_id: 'customer_2',
    service_type: 'Office Relocation',
    pickup_address: '123, Nehru Place, South Delhi',
    pickup_city: 'Delhi',
    pickup_state: 'Delhi',
    pickup_pincode: '110019',
    delivery_address: 'Sector 62, Noida',
    delivery_city: 'Noida',
    delivery_state: 'Uttar Pradesh',
    delivery_pincode: '201301',
    pickup_date: '2026-05-12',
    delivery_date: '2026-05-12',
    estimated_delivery: '2026-05-12',
    status: 'delivered',
    driver_id: 'driver_2',
    vehicle_number: 'DL 05 CD 5678',
    distance_km: 28,
    weight_kg: 800,
    items_description: 'Office furniture, computers, printers, and files',
    special_instructions: 'Complete move within office hours (9 AM - 6 PM)',
    price_estimate: 18000,
    final_price: 18000,
    payment_status: 'paid'
  },
  {
    booking_number: 'ASZE2026050003',
    customer_id: 'customer_3',
    service_type: 'Car Relocation',
    pickup_address: '78, Brigade Road, MG Road',
    pickup_city: 'Bangalore',
    pickup_state: 'Karnataka',
    pickup_pincode: '560001',
    delivery_address: '56, Park Street, Esplanade',
    delivery_city: 'Kolkata',
    delivery_state: 'West Bengal',
    delivery_pincode: '700016',
    pickup_date: '2026-05-18',
    estimated_delivery: '2026-05-21',
    status: 'confirmed',
    driver_id: 'driver_4',
    vehicle_number: 'WB 02 GH 3456',
    distance_km: 1890,
    items_description: 'Honda City 2024 - Excellent condition',
    special_instructions: 'Door-to-door enclosed carrier service required',
    price_estimate: 28000,
    final_price: 28000,
    payment_status: 'pending'
  },
  {
    booking_number: 'ASZE2026050004',
    customer_id: 'customer_4',
    service_type: 'Fine Art Logistics',
    pickup_address: '56, Park Street, Esplanade',
    pickup_city: 'Kolkata',
    pickup_state: 'West Bengal',
    pickup_pincode: '700016',
    delivery_address: 'National Gallery, Janpath',
    delivery_city: 'Delhi',
    delivery_state: 'Delhi',
    delivery_pincode: '110001',
    pickup_date: '2026-05-20',
    estimated_delivery: '2026-05-22',
    status: 'confirmed',
    driver_id: 'driver_2',
    vehicle_number: 'DL 05 CD 5678',
    distance_km: 1425,
    weight_kg: 150,
    items_description: '5 antique paintings and 3 sculptures for exhibition',
    special_instructions: 'Climate-controlled transport, full insurance coverage required',
    price_estimate: 65000,
    final_price: 65000,
    payment_status: 'partial'
  },
  {
    booking_number: 'ASZE2026050005',
    customer_id: 'customer_5',
    service_type: 'Home Relocation',
    pickup_address: '34, Banjara Hills, Road No 12',
    pickup_city: 'Hyderabad',
    pickup_state: 'Telangana',
    pickup_pincode: '500034',
    delivery_address: '45, MG Road, Colaba',
    delivery_city: 'Mumbai',
    delivery_state: 'Maharashtra',
    delivery_pincode: '400001',
    pickup_date: '2026-05-25',
    estimated_delivery: '2026-05-27',
    status: 'pending',
    distance_km: 710,
    weight_kg: 950,
    items_description: '2 BHK apartment - furniture and household items',
    special_instructions: 'Need packing materials and assembly service at destination',
    price_estimate: 38000,
    payment_status: 'pending'
  },
  {
    booking_number: 'ASZE2026040001',
    customer_id: 'customer_1',
    service_type: 'Office Relocation',
    pickup_address: '45, MG Road, Colaba',
    pickup_city: 'Mumbai',
    pickup_state: 'Maharashtra',
    pickup_pincode: '400001',
    delivery_address: 'Bandra Kurla Complex',
    delivery_city: 'Mumbai',
    delivery_state: 'Maharashtra',
    delivery_pincode: '400051',
    pickup_date: '2026-04-10',
    delivery_date: '2026-04-10',
    estimated_delivery: '2026-04-10',
    status: 'delivered',
    driver_id: 'driver_1',
    vehicle_number: 'MH 02 AB 1234',
    distance_km: 18,
    weight_kg: 600,
    items_description: 'Small office setup with desks and computers',
    price_estimate: 12000,
    final_price: 12000,
    payment_status: 'paid'
  }
];

export const dummyPayments = [
  {
    payment_id: 'PAY2026050001',
    booking_id: 'booking_1',
    customer_id: 'customer_1',
    amount: 22500,
    payment_method: 'razorpay',
    payment_type: 'advance',
    transaction_id: 'rzp_live_1234567890',
    payment_status: 'completed',
    payment_date: '2026-05-10',
    invoice_number: 'INV2026050001'
  },
  {
    payment_id: 'PAY2026050002',
    booking_id: 'booking_2',
    customer_id: 'customer_2',
    amount: 18000,
    payment_method: 'stripe',
    payment_type: 'full',
    transaction_id: 'pi_1234567890abcdef',
    payment_status: 'completed',
    payment_date: '2026-05-11',
    invoice_number: 'INV2026050002'
  },
  {
    payment_id: 'PAY2026050003',
    booking_id: 'booking_4',
    customer_id: 'customer_4',
    amount: 32500,
    payment_method: 'razorpay',
    payment_type: 'advance',
    transaction_id: 'rzp_live_0987654321',
    payment_status: 'completed',
    payment_date: '2026-05-14',
    invoice_number: 'INV2026050004'
  },
  {
    payment_id: 'PAY2026040001',
    booking_id: 'booking_6',
    customer_id: 'customer_1',
    amount: 12000,
    payment_method: 'paypal',
    payment_type: 'full',
    transaction_id: 'PAYID-123456789',
    payment_status: 'completed',
    payment_date: '2026-04-09',
    invoice_number: 'INV2026040001'
  }
];

export const dummyReviews = [
  {
    booking_id: 'booking_2',
    customer_id: 'customer_2',
    driver_id: 'driver_2',
    rating: 5,
    service_rating: 5,
    driver_rating: 5,
    delivery_rating: 5,
    title: 'Excellent Service!',
    comment: 'ASZE Relocation made our office move seamless. The team was professional, punctual, and handled everything with care. Highly recommend!',
    review_type: 'overall',
    status: 'approved',
    is_featured: true
  },
  {
    booking_id: 'booking_6',
    customer_id: 'customer_1',
    driver_id: 'driver_1',
    rating: 4,
    service_rating: 4,
    driver_rating: 5,
    delivery_rating: 4,
    title: 'Great Experience',
    comment: 'Very satisfied with the service. The driver was very helpful and all items were delivered safely. Will use again!',
    review_type: 'overall',
    status: 'approved',
    is_featured: true
  },
  {
    booking_id: 'booking_1',
    customer_id: 'customer_1',
    driver_id: 'driver_3',
    rating: 5,
    service_rating: 5,
    driver_rating: 5,
    delivery_rating: 5,
    title: 'Outstanding Service',
    comment: 'The entire relocation process was smooth. Real-time tracking was very helpful. Driver was courteous and professional.',
    review_type: 'overall',
    status: 'approved',
    is_featured: false
  }
];

export const dummyComplaints = [
  {
    complaint_number: 'COMP2026050001',
    booking_id: 'booking_1',
    customer_id: 'customer_1',
    category: 'delay',
    subject: 'Slight delay in pickup',
    description: 'The pickup was delayed by 2 hours from the scheduled time.',
    priority: 'low',
    status: 'resolved',
    assigned_to: 'admin@aszerelocation.com',
    resolution: 'Apologized to customer and provided 10% discount on final payment',
    resolved_at: '2026-05-11'
  }
];

export const dummyLiveTracking = [
  {
    booking_id: 'booking_1',
    driver_id: 'driver_3',
    current_lat: 13.0827,
    current_lng: 80.2707,
    speed_kmh: 65,
    heading: 180,
    last_updated: new Date().toISOString(),
    battery_level: 85,
    is_tracking_active: true
  }
];

export const dummyNotifications = [
  {
    user_id: 'customer_1',
    user_role: 'customer',
    title: 'Booking Confirmed',
    message: 'Your booking #ASZE2026050001 has been confirmed. Driver will contact you soon.',
    type: 'booking',
    is_read: false,
    action_url: '/customer/bookings/ASZE2026050001'
  },
  {
    user_id: 'customer_1',
    user_role: 'customer',
    title: 'Shipment In Transit',
    message: 'Your shipment is now in transit. Track it live on our platform.',
    type: 'tracking',
    is_read: false,
    action_url: '/tracking'
  },
  {
    user_id: 'driver_3',
    user_role: 'driver',
    title: 'New Assignment',
    message: 'You have been assigned booking #ASZE2026050001. Check details.',
    type: 'booking',
    is_read: true,
    action_url: '/driver/bookings/ASZE2026050001'
  }
];

// Seed Database Function
export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Note: In production, you would create these tables in Supabase Dashboard
    // This seed function assumes tables are already created

    // For demo purposes, we'll store seed data in localStorage
    // In production, you would insert into actual Supabase tables

    localStorage.setItem('seed_users', JSON.stringify(dummyUsers));
    localStorage.setItem('seed_bookings', JSON.stringify(dummyBookings));
    localStorage.setItem('seed_payments', JSON.stringify(dummyPayments));
    localStorage.setItem('seed_reviews', JSON.stringify(dummyReviews));
    localStorage.setItem('seed_complaints', JSON.stringify(dummyComplaints));
    localStorage.setItem('seed_tracking', JSON.stringify(dummyLiveTracking));
    localStorage.setItem('seed_notifications', JSON.stringify(dummyNotifications));

    console.log('Database seeding completed successfully!');
    console.log('Seed data stored in localStorage for demo purposes');

    return {
      success: true,
      message: 'Database seeded successfully with dummy data',
      data: {
        users: dummyUsers.length,
        bookings: dummyBookings.length,
        payments: dummyPayments.length,
        reviews: dummyReviews.length,
        complaints: dummyComplaints.length,
        tracking: dummyLiveTracking.length,
        notifications: dummyNotifications.length
      }
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      message: 'Failed to seed database',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Helper functions to get dummy data
export function getAllUsers() {
  const data = localStorage.getItem('seed_users');
  return data ? JSON.parse(data) : dummyUsers;
}

export function getCustomers() {
  return getAllUsers().filter((u: any) => u.role === 'customer');
}

export function getDrivers() {
  return getAllUsers().filter((u: any) => u.role === 'driver');
}

export function getAllBookings() {
  const data = localStorage.getItem('seed_bookings');
  return data ? JSON.parse(data) : dummyBookings;
}

export function getAllPayments() {
  const data = localStorage.getItem('seed_payments');
  return data ? JSON.parse(data) : dummyPayments;
}

export function getAllReviews() {
  const data = localStorage.getItem('seed_reviews');
  return data ? JSON.parse(data) : dummyReviews;
}

export function getNotifications(userId: string) {
  const data = localStorage.getItem('seed_notifications');
  const notifications = data ? JSON.parse(data) : dummyNotifications;
  return notifications.filter((n: any) => n.user_id === userId);
}
