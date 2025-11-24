// Hook to get current admin ID from Firebase Auth
import { useState, useEffect } from 'react';
import { auth } from '@/config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export function useCurrentAdmin(): { adminId: string | null } {
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setAdminId(user?.uid || null);
    });

    return () => unsubscribe();
  }, []);

  return { adminId };
}
