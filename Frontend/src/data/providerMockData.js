// Mock data for provider dashboard

export const mockProviderProfile = {
  full_name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+1 (555) 123-4567',
  bio: 'Professional web developer with 8+ years of experience in creating modern, responsive websites and web applications. Specialized in React, TypeScript, and full-stack development.',
  location: 'San Francisco, CA',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  hourly_rate: 75,
  years_experience: 8
};

export const mockProviderStats = {
  totalEarnings: 12450.50,
  activeOrders: 5,
  completedOrders: 47,
  averageRating: 4.8,
  pendingOrders: 3,
  thisMonthEarnings: 3200.00
};

export const mockProviderOrders = [
  {
    id: '1',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah.j@example.com',
    customer_phone: '+1 (555) 234-5678',
    skill_name: 'Website Development',
    status: 'pending',
    urgency: 'normal',
    price: 850.00,
    created_at: new Date().toISOString(),
    scheduled_date: new Date(Date.now() + 86400000 * 2).toISOString(),
    notes: 'Need a landing page for my new startup'
  },
  {
    id: '2',
    customer_name: 'Michael Chen',
    customer_email: 'michael.chen@example.com',
    customer_phone: '+1 (555) 345-6789',
    skill_name: 'E-commerce Website',
    status: 'in_progress',
    urgency: 'normal',
    price: 1500.00,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    scheduled_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    notes: 'Full e-commerce site with payment integration'
  },
  {
    id: '3',
    customer_name: 'Emily Davis',
    customer_email: 'emily.d@example.com',
    customer_phone: '+1 (555) 456-7890',
    skill_name: 'Mobile App Development',
    status: 'in_progress',
    urgency: 'urgent',
    price: 2200.00,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    scheduled_date: new Date(Date.now() + 86400000 * 10).toISOString(),
    notes: 'iOS and Android app for fitness tracking'
  },
  {
    id: '4',
    customer_name: 'James Wilson',
    customer_email: 'james.w@example.com',
    customer_phone: '+1 (555) 567-8901',
    skill_name: 'UI/UX Design',
    status: 'pending',
    urgency: 'urgent',
    price: 650.00,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    scheduled_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    notes: 'Redesign existing dashboard interface - client needs it ASAP'
  },
  {
    id: '5',
    customer_name: 'Lisa Anderson',
    customer_email: 'lisa.a@example.com',
    customer_phone: '+1 (555) 678-9012',
    skill_name: 'SEO Optimization',
    status: 'pending',
    urgency: 'normal',
    price: 450.00,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    scheduled_date: new Date(Date.now() + 86400000 * 7).toISOString(),
    notes: 'Improve website search ranking'
  },
  {
    id: '6',
    customer_name: 'David Martinez',
    customer_email: 'david.m@example.com',
    customer_phone: '+1 (555) 789-0123',
    skill_name: 'Website Development',
    status: 'pending',
    urgency: 'emergency',
    price: 1200.00,
    created_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    scheduled_date: new Date(Date.now() + 86400000 * 1).toISOString(),
    notes: 'URGENT: Website crashed, need immediate fix and redesign!'
  },
  {
    id: '7',
    customer_name: 'Rachel Green',
    customer_email: 'rachel.g@example.com',
    customer_phone: '+1 (555) 890-1234',
    skill_name: 'Mobile App Development',
    status: 'completed',
    urgency: 'normal',
    price: 1800.00,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    scheduled_date: new Date(Date.now() - 86400000 * 5).toISOString(),
    notes: 'Simple mobile app for local business',
    completed_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: '8',
    customer_name: 'Tom Harris',
    customer_email: 'tom.h@example.com',
    customer_phone: '+1 (555) 901-2345',
    skill_name: 'E-commerce Website',
    status: 'cancelled',
    urgency: 'normal',
    price: 950.00,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    scheduled_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Client changed mind about project scope',
    completed_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export const mockProviderHistory = [
  {
    id: '101',
    customer_name: 'Robert Taylor',
    skill_name: 'Website Development',
    status: 'completed',
    price: 950.00,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    completed_at: new Date(Date.now() - 86400000 * 23).toISOString(),
    rating: 5,
    review: 'Excellent work! Very professional and delivered on time.'
  },
  {
    id: '102',
    customer_name: 'Jennifer Martinez',
    skill_name: 'Mobile App Development',
    status: 'completed',
    price: 2500.00,
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
    completed_at: new Date(Date.now() - 86400000 * 35).toISOString(),
    rating: 5,
    review: 'Amazing developer! The app works flawlessly.'
  },
  {
    id: '103',
    customer_name: 'David Brown',
    skill_name: 'E-commerce Website',
    status: 'completed',
    price: 1800.00,
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
    completed_at: new Date(Date.now() - 86400000 * 48).toISOString(),
    rating: 4,
    review: 'Great work, minor delays but overall satisfied.'
  },
  {
    id: '104',
    customer_name: 'Amanda White',
    skill_name: 'UI/UX Design',
    status: 'completed',
    price: 700.00,
    created_at: new Date(Date.now() - 86400000 * 70).toISOString(),
    completed_at: new Date(Date.now() - 86400000 * 63).toISOString(),
    rating: 5,
    review: 'Beautiful design! Exactly what I wanted.'
  },
  {
    id: '105',
    customer_name: 'Christopher Lee',
    skill_name: 'Website Development',
    status: 'cancelled',
    price: 850.00,
    created_at: new Date(Date.now() - 86400000 * 80).toISOString(),
    completed_at: new Date(Date.now() - 86400000 * 75).toISOString()
  }
];

export const mockProviderSkills = [
  { id: '1', name: 'Website Development', price: 75 },
  { id: '2', name: 'Mobile App Development', price: 95 },
  { id: '3', name: 'E-commerce Website', price: 85 },
  { id: '4', name: 'UI/UX Design', price: 65 },
  { id: '5', name: 'SEO Optimization', price: 55 }
];

export const mockProviderGallery = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
  'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=400',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
  'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400'
];

export const mockMonthlyEarnings = [
  { month: 'Aug', earnings: 2100.00, orders: 8 },
  { month: 'Sep', earnings: 2450.00, orders: 9 },
  { month: 'Oct', earnings: 1950.00, orders: 7 },
  { month: 'Nov', earnings: 2800.00, orders: 11 },
  { month: 'Dec', earnings: 2350.00, orders: 9 },
  { month: 'Jan', earnings: 3200.00, orders: 12 }
];

export const mockTopServices = [
  { name: 'Mobile App Development', count: 15, revenue: 6800.00 },
  { name: 'E-commerce Website', count: 12, revenue: 5200.00 },
  { name: 'Website Development', count: 10, revenue: 4100.00 },
  { name: 'UI/UX Design', count: 8, revenue: 2600.00 },
  { name: 'SEO Optimization', count: 5, revenue: 1500.00 }
];

export const mockProviderReviews = [
  {
    id: '1',
    customer_name: 'Robert Taylor',
    rating: 5,
    comment: 'Excellent work! Very professional and delivered on time. The website looks amazing and works perfectly.',
    created_at: new Date(Date.now() - 86400000 * 23).toISOString(),
    skill_name: 'Website Development'
  },
  {
    id: '2',
    customer_name: 'Jennifer Martinez',
    rating: 5,
    comment: 'Amazing developer! The app works flawlessly and the code quality is top-notch.',
    created_at: new Date(Date.now() - 86400000 * 35).toISOString(),
    skill_name: 'Mobile App Development'
  },
  {
    id: '3',
    customer_name: 'David Brown',
    rating: 4,
    comment: 'Great work, minor delays but overall satisfied with the final product.',
    created_at: new Date(Date.now() - 86400000 * 48).toISOString(),
    skill_name: 'E-commerce Website'
  },
  {
    id: '4',
    customer_name: 'Amanda White',
    rating: 5,
    comment: 'Beautiful design! Exactly what I wanted. Very creative and responsive to feedback.',
    created_at: new Date(Date.now() - 86400000 * 63).toISOString(),
    skill_name: 'UI/UX Design'
  },
  {
    id: '5',
    customer_name: 'Michael Rodriguez',
    rating: 5,
    comment: 'Outstanding service! Highly recommended for any web development project.',
    created_at: new Date(Date.now() - 86400000 * 70).toISOString(),
    skill_name: 'Website Development'
  }
];
