// Mock data for chat functionality

export const mockConversations = [
  {
    id: 'conv-1',
    participantId: 'user-1',
    participantName: 'John Smith',
    participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    participantRole: 'provider',
    lastMessage: 'Sure, I can help you with that. When would you like to schedule?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    unreadCount: 2,
    isOnline: true,
    isTyping: false
  },
  {
    id: 'conv-2',
    participantId: 'user-2',
    participantName: 'Sarah Johnson',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    participantRole: 'provider',
    lastMessage: 'Thank you! The work looks great.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 'conv-20',
    participantId: 'user-1',
    participantName: 'John Smith',
    participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    participantRole: 'provider',
    lastMessage: 'Sure, I can help you with that. When would you like to schedule?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    unreadCount: 2,
    isOnline: true,
    isTyping: false
  },
  {
    id: 'conv-1',
    participantId: 'user-1',
    participantName: 'John Smith',
    participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    participantRole: 'provider',
    lastMessage: 'Sure, I can help you with that. When would you like to schedule?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    unreadCount: 2,
    isOnline: true,
    isTyping: false
  },
  {
    id: 'conv-1',
    participantId: 'user-1',
    participantName: 'John Smith',
    participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    participantRole: 'provider',
    lastMessage: 'Sure, I can help you with that. When would you like to schedule?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    unreadCount: 2,
    isOnline: true,
    isTyping: false
  },
  {
    id: 'conv-1',
    participantId: 'user-1',
    participantName: 'John Smith',
    participantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    participantRole: 'provider',
    lastMessage: 'Sure, I can help you with that. When would you like to schedule?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    unreadCount: 2,
    isOnline: true,
    isTyping: false
  },
  {
    id: 'conv-3',
    participantId: 'user-3',
    participantName: 'Michael Chen',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    participantRole: 'provider',
    lastMessage: 'I need some help with my website design',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    unreadCount: 1,
    isOnline: false
  },
  {
    id: 'conv-4',
    participantId: 'user-4',
    participantName: 'Emily Davis',
    participantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    participantRole: 'provider',
    lastMessage: 'Can we reschedule to next week?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    unreadCount: 0,
    isOnline: false
  },
  {
    id: 'conv-5',
    participantId: 'user-5',
    participantName: 'David Martinez',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    participantRole: 'user',
    lastMessage: 'Perfect! See you tomorrow.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    unreadCount: 0,
    isOnline: false
  },
  {
    id: 'conv-6',
    participantId: 'user-6',
    participantName: 'Lisa Anderson',
    participantAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    participantRole: 'provider',
    lastMessage: 'How much would it cost for a logo design?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    unreadCount: 0,
    isOnline: true
  }
];

export const mockMessages = {
  'conv-1': [
    {
      id: 'msg-1-1',
      conversationId: 'conv-1',
      senderId: 'current-user',
      senderName: 'You',
      text: 'Hi John! I saw your profile and I\'m interested in your web development services.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: true,
      isMine: true
    },
    {
      id: 'msg-1-2',
      conversationId: 'conv-1',
      senderId: 'user-1',
      senderName: 'John Smith',
      text: 'Hello! Thank you for reaching out. I\'d be happy to help. What kind of project are you working on?',
      timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      read: true,
      isMine: false
    },
    {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'current-user',
      senderName: 'You',
      text: 'I need a landing page for my startup. Something modern and responsive.',
      timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
      read: true,
      isMine: true
    },
    {
      id: 'msg-1-4',
      conversationId: 'conv-1',
      senderId: 'user-1',
      senderName: 'John Smith',
      text: 'Sure, I can help you with that. When would you like to schedule?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false,
      isMine: false
    }
  ],

  'conv-2': [
    {
      id: 'msg-2-1',
      conversationId: 'conv-2',
      senderId: 'current-user',
      senderName: 'You',
      text: 'Hi Sarah, I need help with UI/UX design for my mobile app.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
      isMine: true
    },
    {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'user-2',
      senderName: 'Sarah Johnson',
      text: 'Hi! I\'d love to help. Can you tell me more about your app?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      read: true,
      isMine: false
    },
    {
      id: 'msg-2-3',
      conversationId: 'conv-2',
      senderId: 'current-user',
      senderName: 'You',
      text: 'It\'s a fitness tracking app. I need modern, clean design with smooth animations.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      read: true,
      isMine: true
    },
    {
      id: 'msg-2-4',
      conversationId: 'conv-2',
      senderId: 'user-2',
      senderName: 'Sarah Johnson',
      text: 'Sounds exciting! I have experience with fitness apps. Let me create some mockups for you.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(),
      read: true,
      isMine: false
    },
    {
      id: 'msg-2-5',
      conversationId: 'conv-2',
      senderId: 'current-user',
      senderName: 'You',
      text: 'Thank you! The work looks great.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: true,
      isMine: true
    }
  ],

  'conv-3': [
    {
      id: 'msg-3-1',
      conversationId: 'conv-3',
      senderId: 'user-3',
      senderName: 'Michael Chen',
      text: 'I need some help with my website design',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: false,
      isMine: false
    }
  ],

  'conv-4': [
    {
      id: 'msg-4-1',
      conversationId: 'conv-4',
      senderId: 'current-user',
      senderName: 'You',
      text: 'Hi Emily, are we still on for this Friday?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      read: true,
      isMine: true
    },
    {
      id: 'msg-4-2',
      conversationId: 'conv-4',
      senderId: 'user-4',
      senderName: 'Emily Davis',
      text: 'Can we reschedule to next week?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      read: true,
      isMine: false
    }
  ],

  'conv-5': [
    {
      id: 'msg-5-1',
      conversationId: 'conv-5',
      senderId: 'user-5',
      senderName: 'David Martinez',
      text: 'Thanks for booking my service! Looking forward to working with you.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
      read: true,
      isMine: false
    },
    {
      id: 'msg-5-2',
      conversationId: 'conv-5',
      senderId: 'current-user',
      senderName: 'You',
      text: 'Perfect! See you tomorrow.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
      isMine: true
    }
  ],

  'conv-6': [
    {
      id: 'msg-6-1',
      conversationId: 'conv-6',
      senderId: 'user-6',
      senderName: 'Lisa Anderson',
      text: 'How much would it cost for a logo design?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      read: true,
      isMine: false
    }
  ]
};

// Helper function to get relative time
export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return time.toLocaleDateString();
};

// Helper function to format message time
export const formatMessageTime = (timestamp) => {
  const time = new Date(timestamp);
  const now = new Date();

  const isToday = time.toDateString() === now.toDateString();
  const isYesterday =
    new Date(now.getTime() - 86400000).toDateString() === time.toDateString();

  const timeStr = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  if (isToday) return timeStr;
  if (isYesterday) return `Yesterday ${timeStr}`;
  return `${time.toLocaleDateString()} ${timeStr}`;
};
