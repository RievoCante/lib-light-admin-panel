// Customer details panel (317px wide) matching Figma design
import { Edit, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUserDisplayName } from '@/hooks/useUserDisplayName';
import { Avatar } from '@/components/common/Avatar';
import type { Chat } from '@/types/chat';

interface CustomerDetailsProps {
  chat: Chat | null;
}

export function CustomerDetails({ chat }: CustomerDetailsProps) {
  const displayName = useUserDisplayName(chat?.userId || null);
  const nameToShow = displayName || chat?.userId || 'Unknown';

  if (!chat) {
    return (
      <div className="w-[317px] h-full bg-white border-l border-[#F3F3F3] p-6">
        <div className="text-sm text-[#757285]">
          Select a chat to view details
        </div>
      </div>
    );
  }

  return (
    <div className="w-[317px] h-full bg-white border-l border-[#F3F3F3] overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-[#F3F3F3] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar userId={chat?.userId || null} size="sm" />
          <div className="text-sm font-semibold">{nameToShow}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs font-semibold"
        >
          <Edit className="w-3 h-3 mr-2" />
          Edit
        </Button>
      </div>

      {/* Customer Info */}
      <div className="p-6 space-y-4">
        <div>
          <div className="text-xs font-semibold text-[#777583] mb-1">
            Channel
          </div>
          <div className="text-xs font-semibold text-black">WhatsAppB2B</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-[#777583] mb-1">ID</div>
          <div className="text-xs font-semibold text-black">{chat.id}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-[#777583] mb-1">
            Phone num.
          </div>
          <div className="text-xs font-semibold text-black">+6267976229012</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-[#777583] mb-1">
            Address
          </div>
          <div className="text-xs font-semibold text-black">
            5467 Richmond View Suite 511, Sunrise,
            <br />
            Kentucky, 43546-6636
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-xs font-semibold text-[#777583] p-0 h-auto"
        >
          + Add new attribute
        </Button>
      </div>

      <div className="border-t border-[#F1F1F1]"></div>

      {/* Notes */}
      <div className="p-6 space-y-4">
        <div className="text-xs font-semibold text-[#777583]">Notes</div>
        <div className="relative">
          <Textarea
            placeholder="Write a note..."
            className="min-h-[81px] bg-[#FAFAFA] border-[#EEEEEE] rounded-lg resize-none pr-12"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-[#777583]" />
            <Smile className="w-4 h-4 text-[#777583]" />
          </div>
        </div>
      </div>
    </div>
  );
}
