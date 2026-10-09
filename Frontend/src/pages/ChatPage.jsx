import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Send,
  Search,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  MessageSquare,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/axiosSetup';
import { connectSocket } from '../lib/socket';
import { useSelector } from 'react-redux';

// Helper function to format relative time
const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  const time = new Date(dateString);
  if (isNaN(time.getTime())) return '';
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return time.toLocaleDateString();
};

export default function ChatPage() {
  const currentUser = useSelector((state) => state.user?.user);
  const myId = currentUser?._id || currentUser?.id;

  const [searchParams] = useSearchParams();
  const partnerIdParam = searchParams.get('partnerId') || searchParams.get('userId');

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  // Load conversations and optionally resolve partner from query param
  useEffect(() => {
    let isMounted = true;

    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        const { data } = await api.get('/api/chat/conversations');
        const list = Array.isArray(data.data) ? data.data : [];

        if (!isMounted) return;

        // If partnerId param is present, ensure they are in the conversation list
        if (partnerIdParam) {
          const existing = list.find(
            (c) =>
              c.participantId === partnerIdParam ||
              c.id === partnerIdParam ||
              c._id === partnerIdParam
          );

          if (existing) {
            setConversations(list);
            setSelectedConversation(existing);
          } else {
            // Fetch partner info directly
            try {
              const partnerRes = await api.get(`/api/chat/partner/${partnerIdParam}`);
              if (partnerRes.data?.data) {
                const partnerConv = partnerRes.data.data;
                const updatedList = [partnerConv, ...list];
                setConversations(updatedList);
                setSelectedConversation(partnerConv);
              } else {
                setConversations(list);
              }
            } catch {
              setConversations(list);
            }
          }
        } else {
          setConversations(list);
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
        if (isMounted) setConversations([]);
      } finally {
        if (isMounted) setLoadingConversations(false);
      }
    };

    fetchConversations();

    return () => {
      isMounted = false;
    };
  }, [partnerIdParam]);

  // Socket connection and real-time listeners
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = connectSocket(token);
    socketRef.current = socket;

    if (myId) {
      socket.emit('join-chat', myId);
    }

    const handleIncomingMessage = (incomingMsg) => {
      const activePartnerId = selectedConversation?.participantId || selectedConversation?.id;
      const isFromActiveChat =
        incomingMsg.conversationId === activePartnerId ||
        incomingMsg.senderId === activePartnerId;

      if (isFromActiveChat) {
        setMessages((prev) => [
          ...prev,
          {
            id: incomingMsg.id || incomingMsg._id || `msg-${Date.now()}`,
            text: incomingMsg.text,
            timestamp: incomingMsg.timestamp || incomingMsg.createdAt || new Date().toISOString(),
            isMine: false,
            read: true,
          },
        ]);

        socket.emit('mark-chat-read', { participantId: activePartnerId });
      }

      // Update conversations list with latest message
      setConversations((prev) => {
        const partnerId = incomingMsg.conversationId || incomingMsg.senderId;
        const index = prev.findIndex(
          (c) => c.participantId === partnerId || c.id === partnerId
        );

        if (index !== -1) {
          const updated = [...prev];
          const conv = updated[index];
          updated[index] = {
            ...conv,
            lastMessage: incomingMsg.text,
            lastMessageTime: incomingMsg.timestamp || new Date().toISOString(),
            unreadCount: isFromActiveChat ? 0 : (conv.unreadCount || 0) + 1,
          };
          // Move active conversation to top
          const [moved] = updated.splice(index, 1);
          return [moved, ...updated];
        }
        return prev;
      });
    };

    const handleUserTyping = ({ senderId, isTyping }) => {
      const activePartnerId = selectedConversation?.participantId || selectedConversation?.id;
      if (senderId === activePartnerId) {
        setIsPartnerTyping(Boolean(isTyping));
      }
    };

    const handleMessagesRead = ({ readBy }) => {
      const activePartnerId = selectedConversation?.participantId || selectedConversation?.id;
      if (readBy === activePartnerId) {
        setMessages((prev) => prev.map((m) => (m.isMine ? { ...m, read: true } : m)));
      }
    };

    socket.on('new-message', handleIncomingMessage);
    socket.on('user-typing', handleUserTyping);
    socket.on('messages-read', handleMessagesRead);

    return () => {
      socket.off('new-message', handleIncomingMessage);
      socket.off('user-typing', handleUserTyping);
      socket.off('messages-read', handleMessagesRead);
    };
  }, [selectedConversation, myId]);

  // Load messages whenever selected conversation changes
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    const participantId = selectedConversation.participantId || selectedConversation.id;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data } = await api.get(`/api/chat/messages/${participantId}`);
        const list = Array.isArray(data.data) ? data.data : [];

        if (isMounted) {
          setMessages(list);
          setIsPartnerTyping(false);
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
        if (isMounted) setMessages([]);
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    };

    fetchMessages();

    // Reset unread count for selected conversation
    setConversations((prev) =>
      prev.map((c) =>
        c.participantId === participantId || c.id === participantId
          ? { ...c, unreadCount: 0 }
          : c
      )
    );

    return () => {
      isMounted = false;
    };
  }, [selectedConversation]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const textToSend = newMessage.trim();
    setNewMessage('');

    const participantId = selectedConversation.participantId || selectedConversation.id;

    // Emit stopped typing
    if (socketRef.current) {
      socketRef.current.emit('typing', { receiverId: participantId, isTyping: false });
    }

    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      conversationId: participantId,
      senderId: myId || 'me',
      text: textToSend,
      timestamp: new Date().toISOString(),
      read: false,
      isMine: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    // Update conversation card preview immediately
    setConversations((prev) => {
      const idx = prev.findIndex(
        (c) => c.participantId === participantId || c.id === participantId
      );
      if (idx !== -1) {
        const updated = [...prev];
        const [moved] = updated.splice(idx, 1);
        return [
          {
            ...moved,
            lastMessage: textToSend,
            lastMessageTime: new Date().toISOString(),
          },
          ...updated,
        ];
      }
      return prev;
    });

    try {
      const res = await api.post('/api/chat/send', {
        receiverId: participantId,
        text: textToSend,
      });

      if (res.data?.data) {
        // Update temporary optimistic message with real DB message ID
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticMsg.id ? { ...m, id: res.data.data.id || res.data.data._id } : m
          )
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    const participantId = selectedConversation?.participantId || selectedConversation?.id;
    if (socketRef.current && participantId) {
      socketRef.current.emit('typing', { receiverId: participantId, isTyping: true });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('typing', { receiverId: participantId, isTyping: false });
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    (conv.participantName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showConversationList = !isMobileView || !selectedConversation;
  const showChatWindow = !isMobileView || selectedConversation;

  return (
    <div className="bg-background min-h-screen">
      <div className="flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-64px)]">
          {/* Conversations Sidebar */}
          {showConversationList && (
            <div
              className={`${
                isMobileView ? 'w-full' : 'w-80 xl:w-96'
              } border-r border-border flex flex-col bg-card h-full overflow-hidden`}
            >
              {/* Header */}
              <div className="p-4 border-b border-border shrink-0 bg-card/95 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl font-bold">Messages</h2>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <ScrollArea className="flex-1">
                {loadingConversations ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p className="text-xs text-muted-foreground">Loading conversations...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="h-6 w-6 opacity-60" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">No conversations yet</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      {searchQuery
                        ? 'No chats match your search query.'
                        : 'Connect with a provider or check your bookings to start a conversation.'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {filteredConversations.map((conversation) => {
                      const isSelected =
                        selectedConversation?.participantId === conversation.participantId ||
                        selectedConversation?.id === conversation.id;

                      const initial = (conversation.participantName || '?').charAt(0);

                      return (
                        <button
                          key={conversation.id || conversation.participantId}
                          onClick={() => handleSelectConversation(conversation)}
                          className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left cursor-pointer ${
                            isSelected ? 'bg-muted/80 border-l-4 border-l-primary' : ''
                          }`}
                        >
                          <div className="relative shrink-0">
                            <Avatar className="h-11 w-11 ring-2 ring-primary/10">
                              <AvatarImage
                                src={conversation.participantAvatar}
                                alt={conversation.participantName}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                                {initial}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="truncate font-semibold text-sm text-foreground">
                                {conversation.participantName}
                              </h3>
                              <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-2">
                                {getRelativeTime(conversation.lastMessageTime)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground truncate flex-1 pr-2">
                                {conversation.lastMessage || 'Start a conversation...'}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <Badge className="ml-2 bg-(--primary-gradient-start) text-white text-[10px] h-5 px-1.5 font-bold">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {/* Chat Window */}
          {showChatWindow && (
            <div
              className={`flex-1 flex flex-col bg-background ${
                isMobileView ? 'z-10 h-full' : 'h-full'
              }`}
            >
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3.5 border-b border-border flex items-center justify-between bg-card/95 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-3">
                      {isMobileView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedConversation(null)}
                          className="h-8 w-8 mr-1"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                      )}

                      <div className="relative">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                          <AvatarImage
                            src={selectedConversation.participantAvatar}
                            alt={selectedConversation.participantName}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                            {(selectedConversation.participantName || '?').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {selectedConversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm leading-tight">
                          {selectedConversation.participantName}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          {isPartnerTyping ? (
                            <span className="text-primary font-medium italic animate-pulse">
                              typing...
                            </span>
                          ) : selectedConversation.isOnline ? (
                            <span className="text-emerald-500 font-medium">Online</span>
                          ) : (
                            'Offline'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 flex flex-col min-h-0 bg-muted/10">
                    <div className="flex-1 overflow-y-auto p-4">
                      {loadingMessages ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                          <p className="text-xs text-muted-foreground">Loading message history...</p>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
                          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                            <Sparkles className="h-7 w-7" />
                          </div>
                          <h4 className="font-bold text-base mb-1">
                            Chat with {selectedConversation.participantName}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Send a greeting to discuss service specifications, availability, and scheduling details.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-w-3xl mx-auto">
                          {messages.map((message, index) => {
                            const showDate =
                              index === 0 ||
                              new Date(messages[index - 1].timestamp).toDateString() !==
                                new Date(message.timestamp).toDateString();

                            return (
                              <div key={message.id || index}>
                                {showDate && (
                                  <div className="flex items-center justify-center my-3">
                                    <Badge
                                      variant="secondary"
                                      className="text-[11px] font-normal px-2 py-0.5 bg-muted/80 text-muted-foreground"
                                    >
                                      {new Date(message.timestamp).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                    </Badge>
                                  </div>
                                )}

                                <div
                                  className={`flex ${
                                    message.isMine ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  <div
                                    className={`max-w-[75%] sm:max-w-[65%] ${
                                      message.isMine ? 'order-2' : 'order-1'
                                    }`}
                                  >
                                    <div
                                      className={`rounded-2xl px-4 py-2.5 shadow-xs ${
                                        message.isMine
                                          ? 'bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white rounded-br-xs'
                                          : 'bg-card border border-border/60 text-foreground rounded-bl-xs'
                                      }`}
                                    >
                                      <p className="text-sm leading-relaxed wrap-break-word">
                                        {message.text}
                                      </p>
                                    </div>
                                    <div
                                      className={`flex items-center gap-1 mt-1 px-1.5 ${
                                        message.isMine ? 'justify-end' : 'justify-start'
                                      }`}
                                    >
                                      <span className="text-[10px] text-muted-foreground">
                                        {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true,
                                        })}
                                      </span>
                                      {message.isMine && (
                                        message.read ? (
                                          <CheckCheck className="h-3 w-3 text-primary" />
                                        ) : (
                                          <Check className="h-3 w-3 text-muted-foreground" />
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {isPartnerTyping && (
                            <div className="flex justify-start">
                              <div className="bg-card border border-border/60 rounded-2xl rounded-bl-xs px-4 py-2 text-xs text-muted-foreground italic flex items-center gap-1.5 shadow-xs">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                              </div>
                            </div>
                          )}

                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-t border-border bg-card/95 backdrop-blur-sm shrink-0">
                      <div className="flex items-end gap-2 max-w-3xl mx-auto">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>

                        <div className="flex-1 relative">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            className="pr-9 h-10 text-sm bg-background"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                          >
                            <Smile className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white h-10 px-4 shrink-0 shadow-md hover:shadow-lg transition-all"
                          size="sm"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 opacity-60" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">No conversation selected</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Select an existing conversation from the left sidebar or start a new chat with a service provider.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}