// Reusable Avatar component with photoUrl support
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';

interface AvatarProps {
  userId: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getAvatarColor(userId: string): string {
  const colors = ['#DFE7AE', '#E8AEE8', '#D9D9D9'];
  const index = userId.charCodeAt(0) % colors.length;
  return colors[index];
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-base',
};

export function Avatar({ userId, size = 'md', className = '' }: AvatarProps) {
  const { user } = useUser(userId);
  const [imageError, setImageError] = useState(false);

  const displayName = user?.displayName || userId || 'Unknown';
  const photoUrl = user?.photoUrl;
  const initials = getInitials(displayName);
  const avatarColor = getAvatarColor(displayName);
  const sizeClass = sizeClasses[size];

  // Show image if photoUrl exists and hasn't errored
  if (photoUrl && !imageError) {
    return (
      <img
        src={photoUrl}
        alt={displayName}
        className={`${sizeClass} rounded-full object-cover ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback to initials
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-medium ${className}`}
      style={{ backgroundColor: avatarColor }}
    >
      {initials}
    </div>
  );
}
