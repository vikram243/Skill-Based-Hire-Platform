import React, { useState, useEffect, useRef } from 'react';
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
  Home,
  Map,
  FileText,
  User,
  LogOut
} from 'lucide-react';
import { mockConversations, mockMessages, getRelativeTime, formatMessageTime } from '../data/chatMockData';
import { toast } from 'sonner';


export default function ChatPage({
}) {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef(null);

  // Check mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    // Load messages for this conversation
    const conversationMessages = mockMessages[conversation.id] || [];
    setMessages(conversationMessages);
    
    // Mark messages as read
    const updatedConversations = conversations.map(conv => 
      conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
    );
    setConversations(updatedConversations);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: 'current-user',
      senderName: 'You',
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      isMine: true
    };

    setMessages([...messages, message]);

    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
        : conv
    );
    setConversations(updatedConversations);

    setNewMessage('');
    toast.success('Message sent');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showConversationList = !isMobileView || !selectedConversation;
  const showChatWindow = !isMobileView || selectedConversation;

  return (
    <div className="bg-background">
      <div className="flex">
        {/* Main Chat Area - Left and Center */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Conversations List */}
          {showConversationList && (
            <div className={`${isMobileView ? 'w-full' : 'w-80 xl:w-96'} border-r border-border flex flex-col bg-card`}>
              {/* Header */}
              <div className="p-4 border-b border-border shrink-0">
                <h2 className="text-2xl mb-4">Messages</h2>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversations */}
              <ScrollArea className="flex-1">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No conversations found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-secondary/50 transition-colors text-left ${
                          selectedConversation?.id === conversation.id ? 'bg-secondary' : ''
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.participantAvatar} alt={conversation.participantName} />
                            <AvatarFallback>{conversation.participantName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {conversation.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="truncate">{conversation.participantName}</h3>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {getRelativeTime(conversation.lastMessageTime)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate flex-1 pr-2 w-20">
                              {conversation.isTyping ? (
                                <span className="italic text-(--primary-gradient-start)">typing...</span>
                              ) : (
                                conversation.lastMessage
                              )}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge className="ml-2 bg-(--primary-gradient-start) text-white">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {/* Chat Window */}
          {showChatWindow && (
            <div className={`flex-1 flex flex-col bg-background ${isMobileView ? 'z-10' : 'h-[calc(100vh-75px)]'}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header - Sticky */}
                  <div className="sticky top-0 z-20 p-4 border-b border-border flex items-center justify-between bg-card/95 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-3">
                      {isMobileView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedConversation(null)}
                          className="mr-2"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                      )}
                      
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConversation.participantAvatar} alt={selectedConversation.participantName} />
                          <AvatarFallback>{selectedConversation.participantName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {selectedConversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium">{selectedConversation.participantName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {selectedConversation.isOnline ? 'Active now' : 'Offline'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages Area with Fixed Input */}
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-4 max-w-4xl mx-auto">
                        {messages.map((message, index) => {
                          const showDate = index === 0 || 
                            new Date(messages[index - 1].timestamp).toDateString() !== new Date(message.timestamp).toDateString();

                          return (
                            <div key={message.id}>
                              {showDate && (
                                <div className="flex items-center justify-center my-4">
                                  <Badge variant="secondary" className="text-xs">
                                    {new Date(message.timestamp).toLocaleDateString('en-US', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </Badge>
                                </div>
                              )}

                              <div className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] ${message.isMine ? 'order-2' : 'order-1'}`}>
                                  <div
                                    className={`rounded-2xl px-4 py-2 ${
                                      message.isMine
                                        ? 'bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white'
                                        : 'bg-secondary text-foreground'
                                    }`}
                                  >
                                    <p className="wrap-break-word">{message.text}</p>
                                  </div>
                                  <div className={`flex items-center gap-1 mt-1 px-2 ${message.isMine ? 'justify-end' : 'justify-start'}`}>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit', 
                                        hour12: true 
                                      })}
                                    </span>
                                    {message.isMine && (
                                      message.read ? (
                                        <CheckCheck className="h-3 w-3 text-blue-400" />
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
                        <div ref={messagesEndRef} />
                      </div>
                    </div>

                    {/* Message Input - Fixed at bottom */}
                    <div className="sticky bottom-0 p-4 border-t border-border bg-card/95 backdrop-blur-sm shrink-0">
                      <div className="flex items-end gap-4 pb-2 max-w-4xl mx-auto">
                        <Button variant="ghost" size="sm" className="mb-1">
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="pr-10 resize-none"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                          >
                            <Smile className="h-5 w-5" />
                          </Button>
                        </div>

                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white"
                          size="sm"
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <MessageSquare className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl mb-2">No conversation selected</h3>
                    <p className="text-muted-foreground">
                      Select a conversation from the list to start messaging
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