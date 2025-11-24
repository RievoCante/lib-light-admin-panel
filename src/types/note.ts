// TypeScript interfaces for admin notes
export interface AdminNote {
  id: string; // Document ID
  userId: string; // User ID (chat ID)
  content: string; // Note content (max 500 chars)
  createdBy: string; // Admin UID from Firebase Auth
  createdAt: Date;
  updatedAt?: Date; // Set when note is edited
}
