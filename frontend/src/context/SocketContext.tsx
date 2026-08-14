import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, NotificationItem } from '../types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  toolExecutionStep: string | null;
  notifications: NotificationItem[];
  sendMessage: (text: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  messages: [],
  isTyping: false,
  toolExecutionStep: null,
  notifications: [],
  sendMessage: () => {},
  markNotificationRead: () => {},
  clearNotifications: () => {}
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [toolExecutionStep, setToolExecutionStep] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: "👋 Welcome to **Binary Brain AI Assistant**! I can help you find products, track live order status, and answer questions. Try typing *\"Where is my order ORD-1001?\"* or *\"Recommend high-end gaming accessories\"*.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Dynamic connection handling for dev server / production
    const socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('connected to websocket server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('disconnected from websocket server');
      setIsConnected(false);
    });

    socketInstance.on('chat:typing', (data: { isTyping: boolean }) => {
      setIsTyping(data.isTyping);
      if (!data.isTyping) setToolExecutionStep(null);
    });

    socketInstance.on('chat:tool_step', (data: { step: string; description: string }) => {
      setToolExecutionStep(data.description);
    });

    socketInstance.on('chat:response', (data: any) => {
      setIsTyping(false);
      setToolExecutionStep(null);

      const newMsg: ChatMessage = {
        id: data.messageId || `msg_${Date.now()}`,
        sender: 'assistant',
        text: data.response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCalls: data.response.toolCallsExecuted,
        payload: data.response.payload
      };

      setMessages(prev => [...prev, newMsg]);
    });

    socketInstance.on('notification:push', (notif: NotificationItem) => {
      setNotifications(prev => [notif, ...prev]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    if (socket && isConnected) {
      socket.emit('chat:message', { message: text, messageId: userMsg.id });
    } else {
      // Fallback via HTTP REST API if socket isn't connected
      setIsTyping(true);
      fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      })
        .then(res => res.json())
        .then(data => {
          setIsTyping(false);
          if (data.success) {
            setMessages(prev => [
              ...prev,
              {
                id: `msg_${Date.now()}`,
                sender: 'assistant',
                text: data.data.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                toolCalls: data.data.toolCallsExecuted,
                payload: data.data.payload
              }
            ]);
          }
        })
        .catch(() => setIsTyping(false));
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      messages,
      isTyping,
      toolExecutionStep,
      notifications,
      sendMessage,
      markNotificationRead,
      clearNotifications
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
