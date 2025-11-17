// Left panel with search (217px wide)
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function LeftPanel() {
  return (
    <div className="w-[217px] h-full bg-white border-r border-[#F3F3F3] p-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
        <Input
          type="text"
          placeholder="Search chat"
          className="pl-8 bg-[#FAFAFA] border-[#EDECF1] h-8 text-xs"
        />
      </div>
    </div>
  );
}
