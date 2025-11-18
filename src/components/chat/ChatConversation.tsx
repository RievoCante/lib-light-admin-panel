// Chat conversation component matching Figma design
import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  User,
  Paperclip,
  Smile,
  Image,
  Bold,
  Italic,
  Underline,
  Send,
} from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { sendAdminMessage } from '@/services/messageService';
import { MessageBubble } from './MessageBubble';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Chat } from '@/types/chat';

interface ChatConversationProps {
  chat: Chat | null;
}

export function ChatConversation({ chat }: ChatConversationProps) {
  const chatId = chat?.id || null;
  const { messages, loading, error } = useMessages(chatId);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatId || !messageText.trim() || sending) return;

    setSending(true);
    try {
      await sendAdminMessage(chatId, messageText);
      setMessageText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FBFBFB]">
        <div className="text-sm text-[#757285]">
          Select a chat to start conversation
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#FBFBFB]">
      {/* Header */}
      <div className="h-[62px] bg-white border-b border-[#F3F3F3] flex items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <div>
            <div className="text-xs font-semibold">{chat.userId}</div>
            <div className="text-xs font-medium text-[#777583]">Online</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <User className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-sm text-destructive">Error: {error.message}</div>
        ) : messages.length === 0 ? (
          <div className="text-sm text-[#757285]">No messages yet</div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-[#F3F3F3] bg-white">
        <form onSubmit={handleSend} className="space-y-3">
          <div className="relative">
            <Textarea
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder='Type "/" to use template message'
              className="min-h-[144px] rounded-xl border-[#EDEDED] resize-none pr-24"
            />
            <div className="absolute bottom-3 left-4 flex items-center gap-3">
              <Paperclip className="w-4 h-4 text-[#797782]" />
              <Smile className="w-4 h-4 text-[#797782]" />
              <Image className="w-4 h-4 text-[#797782]" />
              <Bold className="w-4 h-4 text-[#797782]" />
              <Italic className="w-4 h-4 text-[#797782]" />
              <Underline className="w-4 h-4 text-[#797782]" />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              size="sm"
              className="h-7 px-2 bg-[#D44928] hover:bg-[#D44928]/90 text-white text-xs font-semibold"
              disabled={!messageText.trim() || sending}
            >
              Send
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
