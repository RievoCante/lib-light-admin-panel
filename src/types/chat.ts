// TypeScript interfaces for chat and message data
export interface SupportMessage {
  id: string; // Firestore document ID
  chatId: string;
  userId: string; // User ID or "admin"
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  type: 'text' | 'faq';
}

export interface Chat {
  id: string; // Document ID (which is the userId)
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: SupportMessage; // For list display
}

export interface ChatError {
  message: string;
  code?: string;
}
