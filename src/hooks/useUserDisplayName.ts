// Helper hook for convenient display name access
import { useUser } from './useUser';

/**
 * Convenience hook to get user display name
 * @param userId - The user ID (Firebase Auth UID)
 * @returns Display name string or null if not available
 */
export function useUserDisplayName(userId: string | null): string | null {
  const { user } = useUser(userId);
  return user?.displayName || null;
}
