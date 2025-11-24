// Message bubble component matching Figma design
import type { SupportMessage } from '@/types/chat';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: SupportMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAdmin = !message.isFromUser;
  const timeStr = format(message.timestamp, 'HH:mm');

  if (isAdmin) {
    // Admin messages: blue, right-aligned
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[401px] bg-[#1D7AD6] text-white rounded-2xl rounded-br-sm px-3 py-2">
          <div className="text-xs font-medium leading-4 mb-2.5">
            {message.content}
          </div>
          <div className="text-xs font-medium leading-4 text-right text-white/80">
            {timeStr}
          </div>
        </div>
      </div>
    );
  }

  // User messages: gray, left-aligned
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[188px] bg-[#F3F4F6] text-black rounded-2xl rounded-bl-sm px-3 py-2">
        <div className="text-xs font-medium leading-4 mb-2.5">
          {message.content}
        </div>
        <div className="text-xs font-medium leading-4 text-right text-[#797782]">
          {timeStr}
        </div>
      </div>
    </div>
  );
}
