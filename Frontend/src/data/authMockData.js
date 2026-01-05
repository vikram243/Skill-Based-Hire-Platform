let currentUser = null;
let currentAdmin = null;

// Predefined mock users
export const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    isProvider: true,
    phone: '9876543210',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  }
];

// Predefined mock admins
export const mockAdmins = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@skillhub.com',
    role: 'Super Admin'
  }
];

// Auth functions
export const mockAuth = {
  // Sign in
  signIn: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.email === email);
    if (user && password) {
      currentUser = user;
      localStorage.setItem('mockUser', JSON.stringify(user));
      return { user, error: null };
    }

    return { user: null, error: 'Invalid credentials' };
  },

  // Sign up
  signUp: async (email, password, name) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
    };

    mockUsers.push(newUser);
    currentUser = newUser;
    localStorage.setItem('mockUser', JSON.stringify(newUser));

    return { user: newUser, error: null };
  },

  // Sign out
  signOut: async () => {
    currentUser = null;
    localStorage.removeItem('mockUser');
  },

  // Get current user
  getUser: async () => {
    if (currentUser) {
      return { user: currentUser };
    }

    const stored = localStorage.getItem('mockUser');
    if (stored) {
      currentUser = JSON.parse(stored);
      return { user: currentUser };
    }

    return { user: null };
  },

  // Admin sign in
  adminSignIn: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const admin = mockAdmins.find(a => a.email === email);
    if (admin && password === 'admin123') {
      currentAdmin = admin;
      localStorage.setItem('mockAdmin', JSON.stringify(admin));
      return { admin, error: null };
    }

    return { admin: null, error: 'Invalid admin credentials' };
  },

  // Admin sign out
  adminSignOut: async () => {
    currentAdmin = null;
    localStorage.removeItem('mockAdmin');
  },

  // Get current admin
  getAdmin: async () => {
    if (currentAdmin) {
      return { admin: currentAdmin };
    }

    const stored = localStorage.getItem('mockAdmin');
    if (stored) {
      currentAdmin = JSON.parse(stored);
      return { admin: currentAdmin };
    }

    return { admin: null };
  }
};
