// Main layout component with four-panel design matching Figma
import { Sidebar } from './Sidebar';
import { LeftPanel } from './LeftPanel';
import { ChatList } from '@/components/chat/ChatList';
import { ChatConversation } from '@/components/chat/ChatConversation';
import { CustomerDetails } from '@/components/chat/CustomerDetails';
import { useParams, useNavigate } from 'react-router-dom';
import { useChats } from '@/hooks/useChats';
import { useEffect } from 'react';

export function Layout() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { chats } = useChats();
  const currentChat = chats.find(chat => chat.id === chatId) || null;

  // Redirect to first chat if on /chats without chatId
  useEffect(() => {
    if (!chatId && chats.length > 0) {
      navigate(`/chats/${chats[0].id}`, { replace: true });
    }
  }, [chatId, chats, navigate]);

  return (
    <div className="h-screen w-full bg-[#FBFBFB] flex overflow-hidden">
      <Sidebar />
      <LeftPanel />
      <ChatList />
      <ChatConversation chat={currentChat} />
      <CustomerDetails chat={currentChat} />
    </div>
  );
}
