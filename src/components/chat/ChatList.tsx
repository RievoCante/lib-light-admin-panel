// Chat list component (304px wide) matching Figma design
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useChats } from '@/hooks/useChats';
import { useUserDisplayName } from '@/hooks/useUserDisplayName';
import { useUnreadCount } from '@/hooks/useUnreadCount';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Avatar } from '@/components/common/Avatar';
import type { Chat } from '@/types/chat';

type FilterType = 'all' | 'unread';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  filter: FilterType;
}

function ChatItem({ chat, isActive, onClick, filter }: ChatItemProps) {
  const displayName = useUserDisplayName(chat.userId);
  const nameToShow = displayName || chat.userId;
  const lastMessage = chat.lastMessage?.content || 'No messages yet';
  const unreadCount = useUnreadCount(chat, isActive);

  // Hide if filter is 'unread' and chat has no unread messages
  if (filter === 'unread' && unreadCount === 0) {
    return null;
  }

  return (
    <div
      className={`flex items-start gap-4.5 p-4 cursor-pointer hover:bg-gray-50 ${
        isActive ? 'bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar userId={chat.userId} size="md" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[#414651] mb-1">
          {nameToShow}
        </div>
        <div className="text-xs font-medium text-[#757285] truncate">
          {lastMessage}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <MoreVertical className="w-4 h-4 text-[#757285]" />
        {unreadCount > 0 && (
          <div className="h-4 w-4 bg-[#D34827] rounded text-[10px] text-white flex items-center justify-center font-medium">
            {unreadCount}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatList() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { chats, loading, error } = useChats();
  const [filter, setFilter] = useState<FilterType>('all');

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
          <button
            onClick={() => setFilter('all')}
            className={`h-7 px-2 py-1.5 rounded-md border shadow-sm flex items-center gap-2 ${
              filter === 'all'
                ? 'bg-[#EFF6FE] border-[#1D7AD6]'
                : 'bg-white border-[#EBEAEF]'
            }`}
          >
            <span className="text-xs font-semibold">All</span>
            <div className="w-3 h-3">
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`h-7 px-2 py-1.5 rounded-md border shadow-sm flex items-center gap-2 ${
              filter === 'unread'
                ? 'bg-[#EFF6FE] border-[#1D7AD6]'
                : 'bg-white border-[#EBEAEF]'
            }`}
          >
            <span className="text-xs font-semibold">Unread</span>
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
              filter={filter}
            />
          ))
        )}
      </div>
    </div>
  );
}
