// Left sidebar with navigation icons (52px wide)
import { useState } from 'react';
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
import { AccountModal } from './AccountModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const navigate = useNavigate();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutConfirmOpen(false);
    await handleLogout();
  };

  return (
    <>
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
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#797782] hover:bg-gray-200 transition-colors"
            title="Account"
          >
            <User className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleLogoutClick}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#797782] hover:bg-gray-200 transition-colors"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <AccountModal
        open={isAccountModalOpen}
        onOpenChange={setIsAccountModalOpen}
      />
      <Dialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogClose onClose={() => setIsLogoutConfirmOpen(false)} />
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-[#757285]">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsLogoutConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogoutConfirm}
                className="bg-[#D44928] hover:bg-[#D44928]/90 text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
