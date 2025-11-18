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
  LogOut,
} from 'lucide-react';
import { signOut } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
      <div className="mt-auto flex flex-col gap-4">
        <User className="w-3.5 h-3.5 text-[#797782]" />
        <button
          onClick={handleLogout}
          className="w-3.5 h-3.5 text-[#797782] hover:text-red-600 transition-colors"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
