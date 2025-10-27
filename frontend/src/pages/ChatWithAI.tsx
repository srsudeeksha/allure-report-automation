// pages/ChatWithAI.tsx
// Chat interface page with AI assistant simulation

import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import type { ChatMessage } from '../types';

/**
 * ChatWithAI page component
 * Provides a chat interface for interacting with an AI assistant
 */
const ChatWithAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Simulate AI response (replace with actual API call)
   */
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple response logic (replace with actual AI API)
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('weather')) {
      return 'I can help you with weather information! Please use the Weather Dashboard to get detailed weather data for any city.';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you today?';
    } else if (lowerMessage.includes('help')) {
      return 'I can help you with:\n• Weather information\n• General questions\n• App navigation\n\nWhat would you like to know?';
    } else {
      return `I understand you said: "${userMessage}". This is a demo AI assistant. In production, this would connect to a real AI API like OpenAI or Anthropic.`;
    }
  };

  /**
   * Handle sending a message
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage.content);

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      // Add assistant message to chat
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Format timestamp for display
   */
  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-hidden bg-background">
          <div className="container mx-auto h-full p-6">
            <Card className="flex h-full flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-6 w-6" />
                  Chat with AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`flex flex-col max-w-[70%] ${
                          message.role === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>

                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form
                  onSubmit={handleSendMessage}
                  className="border-t p-4 flex gap-2"
                >
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isTyping}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isTyping || !inputMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatWithAI;