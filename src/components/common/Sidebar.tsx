// Left sidebar with navigation icons (52px wide)
import {
  Search,
  MessageSquare,
  Home,
  Monitor,
  Bell,
  Folder,
  Settings,
  HelpCircle,
  User,
} from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-[52px] h-full bg-[#FDFDFD] border-r border-[#F2F2F2] flex flex-col items-center py-4 gap-6">
      <Search className="w-3.5 h-3.5 text-[#797782]" />
      <MessageSquare className="w-3.5 h-3.5 text-[#797782]" />
      <Home className="w-3.5 h-3.5 text-[#797782]" />
      <Monitor className="w-3.5 h-3.5 text-[#797782]" />
      <Bell className="w-3.5 h-3.5 text-[#797782]" />
      <Folder className="w-3.5 h-3.5 text-[#797782]" />
      <Settings className="w-3.5 h-3.5 text-[#797782]" />
      <HelpCircle className="w-3.5 h-3.5 text-[#797782]" />
      <div className="mt-auto">
        <User className="w-3.5 h-3.5 text-[#797782]" />
      </div>
    </div>
  );
}
