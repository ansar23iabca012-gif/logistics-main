import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Sparkles,
  Phone,
  Mail,
  Package,
  CreditCard,
  MapPin
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const quickActions = [
  { icon: Package, label: 'Track Shipment', query: 'How do I track my shipment?' },
  { icon: CreditCard, label: 'Payment Help', query: 'I need help with payment' },
  { icon: MapPin, label: 'Book Service', query: 'I want to book a relocation service' },
  { icon: Phone, label: 'Contact Support', query: 'How can I contact support?' }
];

const chatbotKnowledge = {
  greetings: [
    'Hello! I\'m ASZE AI Assistant. How can I help you today?',
    'Hi there! Welcome to ASZE Relocation. What can I assist you with?',
    'Greetings! I\'m here to help with your relocation needs.'
  ],
  tracking: {
    keywords: ['track', 'tracking', 'shipment', 'location', 'where is my'],
    responses: [
      'You can track your shipment in real-time! Simply go to our Tracking page and enter your booking number. You\'ll be able to see live GPS location, estimated delivery time, and delivery status.',
      'To track your shipment:\n1. Go to Tracking page\n2. Enter your booking number\n3. View real-time location on the map\n\nYou can also click "Track Shipment" in your customer dashboard!'
    ]
  },
  booking: {
    keywords: ['book', 'booking', 'service', 'relocation', 'move', 'quote'],
    responses: [
      'I can help you book a relocation service! We offer:\n• Home Relocation\n• Office Relocation\n• Car Relocation\n• Fine Art Logistics\n• Warehouse Facility\n\nClick "Get Quote" in the header or visit our Services page to get started!',
      'Booking is easy! Visit our home page, select your service type, fill in the details, and submit. Our team will contact you within 24 hours with a customized quote.'
    ]
  },
  payment: {
    keywords: ['payment', 'pay', 'price', 'cost', 'charge', 'bill', 'invoice'],
    responses: [
      'We accept multiple payment methods:\n• Razorpay (UPI, Cards, Net Banking)\n• Stripe (International Cards)\n• PayPal\n\nYou can pay 50% advance and rest on delivery. All payments are secure and encrypted.',
      'Payment is flexible! We offer advance payment (50%) or full payment options. You\'ll receive a digital invoice immediately after payment.'
    ]
  },
  contact: {
    keywords: ['contact', 'support', 'help', 'phone', 'email', 'call'],
    responses: [
      'You can reach us at:\n📞 Phone: 6200573418\n📞 Toll-Free: 1800 170 6200\n📧 Email: info@aszerelocation.com\n\nOur support team is available 24/7!',
      'Need to talk to someone? Call our toll-free number 1800 170 6200 or email us at info@aszerelocation.com. We\'re here to help 24/7!'
    ]
  },
  branches: {
    keywords: ['branch', 'office', 'location', 'address', 'city'],
    responses: [
      'We have branches in 5 major cities:\n• Mumbai\n• Delhi\n• Bangalore\n• Kolkata\n• Hyderabad\n\nVisit our Branches page to see addresses and contact details for each location.'
    ]
  },
  services: {
    keywords: ['service', 'what do you', 'offer', 'provide'],
    responses: [
      'We offer comprehensive relocation services:\n\n🏠 Home Relocation - Complete household moving\n🏢 Office Relocation - Business & corporate moves\n🚗 Car Relocation - Vehicle transportation\n🎨 Fine Art Logistics - Specialized art handling\n🏭 Warehouse Facility - Storage solutions\n\nAll services include packing, loading, transportation, and insurance!'
    ]
  },
  pricing: {
    keywords: ['price', 'cost', 'rate', 'expensive', 'cheap', 'affordable'],
    responses: [
      'Our pricing depends on:\n• Distance between pickup and delivery\n• Type and volume of items\n• Service type selected\n• Additional services (packing, insurance)\n\nRequest a free quote to get accurate pricing for your specific needs!'
    ]
  },
  insurance: {
    keywords: ['insurance', 'safe', 'damage', 'protection', 'coverage'],
    responses: [
      'Yes! We provide comprehensive insurance coverage for all relocations. Your belongings are protected against damage, loss, or theft during transit. Insurance details are included in your quote.'
    ]
  }
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m ASZE AI Assistant powered by advanced AI. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        'Track my shipment',
        'Book a service',
        'Payment options',
        'Contact support'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for greetings
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/.test(lowerMessage)) {
      return chatbotKnowledge.greetings[Math.floor(Math.random() * chatbotKnowledge.greetings.length)];
    }

    // Check each knowledge category
    for (const [category, data] of Object.entries(chatbotKnowledge)) {
      if (category === 'greetings') continue;

      const { keywords, responses } = data as { keywords: string[]; responses: string[] };
      const hasKeyword = keywords.some(keyword => lowerMessage.includes(keyword));

      if (hasKeyword) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Default response
    return 'I understand you\'re asking about something specific. For detailed assistance, please:\n\n• Call us at 1800 170 6200\n• Email info@aszerelocation.com\n• Visit our Contact page\n\nOur team will be happy to help you!';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['Track shipment', 'Book service', 'Contact support']
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              <MessageCircle className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className={`shadow-2xl overflow-hidden ${isMinimized ? 'h-auto' : 'h-[600px]'} w-96`}>
              {/* Header */}
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base">ASZE AI Assistant</CardTitle>
                      <p className="text-xs text-blue-100 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Online • Always here to help
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  {/* Messages Area */}
                  <CardContent className="p-4 h-[400px] overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                      {/* Quick Actions */}
                      {messages.length === 1 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {quickActions.map((action, index) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => handleQuickAction(action.query)}
                              className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                            >
                              <action.icon className="w-4 h-4 text-blue-600 mb-1" />
                              <p className="text-xs font-medium text-gray-900">{action.label}</p>
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {/* Messages */}
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.sender === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                              }`}
                            >
                              {message.sender === 'user' ? (
                                <User className="w-4 h-4" />
                              ) : (
                                <Bot className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div
                                className={`p-3 rounded-lg ${
                                  message.sender === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-900'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-line">{message.text}</p>
                              </div>
                              {message.suggestions && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {message.suggestions.map((suggestion, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="cursor-pointer hover:bg-blue-50"
                                      onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                      {suggestion}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-2"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t">
                    <div className="flex gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Powered by AI • Available 24/7
                    </p>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
