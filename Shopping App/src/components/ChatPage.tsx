import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, MoreVertical, Phone, Video } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
}

interface Product {
  id: number;
  name: string;
  price?: string;
  currentBid?: string;
  images: string[];
  seller: string;
  category: string;
}

interface ChatPageProps {
  product: Product;
  onBack: () => void;
  onMenuClick: () => void;
}

export default function ChatPage({ 
  product, 
  onBack, 
  onMenuClick 
}: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hi! I'm interested in the ${product.name}. Is it still available?`,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isOwn: true,
      status: "read"
    },
    {
      id: "2", 
      text: "Hello! Yes, it's still available. It's in excellent condition as mentioned in the listing.",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      isOwn: false
    },
    {
      id: "3",
      text: "Great! Can you tell me more about the warranty and any accessories included?",
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      isOwn: true,
      status: "read"
    },
    {
      id: "4",
      text: "It comes with original box, charger, and has 6 months seller warranty. All accessories are included.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      isOwn: false
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date(),
        isOwn: true,
        status: "sent"
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Simulate seller typing and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your message! I'll get back to you shortly.",
          timestamp: new Date(),
          isOwn: false
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-3">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {product.seller.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{product.seller}</h3>
              <p className="text-sm text-gray-500">Usually replies within an hour</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Product Info Card */}
      <div className="m-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center space-x-3">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-medium">{product.name}</h4>
            <p className="text-sm text-gray-600">
              {product.price || product.currentBid}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 capitalize">
              {product.category.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
              message.isOwn 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-900'
            }`}>
              <p>{message.text}</p>
              <div className={`flex items-center justify-end mt-1 space-x-1 ${
                message.isOwn ? 'text-blue-100' : 'text-gray-500'
              }`}>
                <span className="text-xs">{formatTime(message.timestamp)}</span>
                {message.isOwn && message.status && (
                  <div className="flex">
                    {message.status === "sent" && <span className="text-xs">✓</span>}
                    {message.status === "delivered" && <span className="text-xs">✓✓</span>}
                    {message.status === "read" && <span className="text-xs text-blue-200">✓✓</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 border border-gray-300 rounded-2xl resize-none max-h-24 pr-12"
              rows={1}
              style={{ minHeight: '44px' }}
            />
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="h-11 w-11 rounded-full p-0 bg-blue-500 hover:bg-blue-600"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}