import { useEffect, useState } from 'react';
import { auth } from '@/config/firebase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface AccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountModal({ open, onOpenChange }: AccountModalProps) {
  const [userInfo, setUserInfo] = useState<{
    email: string | null;
    uid: string;
    createdAt: string | null;
    lastSignIn: string | null;
  } | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserInfo({
        email: user.email,
        uid: user.uid,
        createdAt: user.metadata.creationTime
          ? format(new Date(user.metadata.creationTime), 'MMM dd, yyyy')
          : null,
        lastSignIn: user.metadata.lastSignInTime
          ? format(new Date(user.metadata.lastSignInTime), 'MMM dd, yyyy')
          : null,
      });
    }
  }, [open]);

  if (!userInfo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Information</DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-semibold text-[#777583] mb-1">
              Email
            </div>
            <div className="text-sm font-semibold text-black">
              {userInfo.email || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#777583] mb-1">
              Created
            </div>
            <div className="text-sm font-semibold text-black">
              {userInfo.createdAt || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#777583] mb-1">
              Signed In
            </div>
            <div className="text-sm font-semibold text-black">
              {userInfo.lastSignIn || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#777583] mb-1">
              User UID
            </div>
            <div className="text-sm font-semibold text-black break-all">
              {userInfo.uid}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
