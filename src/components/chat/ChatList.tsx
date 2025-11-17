// Chat list component (304px wide) matching Figma design
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useChats } from '@/hooks/useChats';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { Chat } from '@/types/chat';

function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getAvatarColor(userId: string): string {
  const colors = ['#DFE7AE', '#E8AEE8', '#D9D9D9'];
  const index = userId.charCodeAt(0) % colors.length;
  return colors[index];
}

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
  const avatarColor = getAvatarColor(chat.userId);
  const initials = getInitials(chat.userId);
  const lastMessage = chat.lastMessage?.content || 'No messages yet';

  return (
    <div
      className={`flex items-start gap-4.5 p-4 cursor-pointer hover:bg-gray-50 ${
        isActive ? 'bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[#414651] mb-1">
          {chat.userId}
        </div>
        <div className="text-xs font-medium text-[#757285] truncate">
          {lastMessage}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <MoreVertical className="w-4 h-4 text-[#757285]" />
        <div className="h-4 w-4 bg-[#D34827] rounded text-[10px] text-white flex items-center justify-center font-medium">
          1
        </div>
      </div>
    </div>
  );
}

export function ChatList() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { chats, loading, error } = useChats();

  if (loading) {
    return (
      <div className="w-[304px] h-full bg-[#FDFDFD] border-r border-[#F3F3F3]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[304px] h-full bg-[#FDFDFD] border-r border-[#F3F3F3] p-4">
        <div className="text-sm text-destructive">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="w-[304px] h-full bg-[#FDFDFD] border-r border-[#F3F3F3] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#F3F3F3]">
        <div className="flex items-center gap-3.5 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <div className="text-sm font-medium">John Doe</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-7 px-2 py-1.5 bg-white rounded-md border border-[#EBEAEF] shadow-sm flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#FD3C39] rounded-full" />
            <span className="text-xs font-semibold">Open</span>
            <div className="w-3 h-3">
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
          </button>
          <button className="h-7 px-2 py-1.5 bg-[#EFF6FE] rounded-md border border-[#1D7AD6] shadow-sm flex items-center gap-2">
            <span className="text-xs font-semibold">Newest</span>
            <div className="w-3 h-3">
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-sm text-[#757285]">No chats</div>
        ) : (
          chats.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === chatId}
              onClick={() => navigate(`/chats/${chat.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
