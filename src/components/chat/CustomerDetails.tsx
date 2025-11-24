// Customer details panel (317px wide) matching Figma design
import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUserDisplayName } from '@/hooks/useUserDisplayName';
import { useUser } from '@/hooks/useUser';
import { useNotes } from '@/hooks/useNotes';
import { useCurrentAdmin } from '@/hooks/useCurrentAdmin';
import { createNote, updateNote, deleteNote } from '@/services/noteService';
import { Avatar } from '@/components/common/Avatar';
import type { Chat } from '@/types/chat';
import type { AdminNote } from '@/types/note';

interface CustomerDetailsProps {
  chat: Chat | null;
}

export function CustomerDetails({ chat }: CustomerDetailsProps) {
  const displayName = useUserDisplayName(chat?.userId || null);
  const nameToShow = displayName || chat?.userId || 'Unknown';
  const { user, loading, error } = useUser(chat?.userId || null);
  const {
    notes,
    loading: notesLoading,
    error: notesError,
  } = useNotes(chat?.userId || null);
  const { adminId } = useCurrentAdmin();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [saving, setSaving] = useState(false);

  const MAX_NOTE_LENGTH = 500;

  const handleCreateNote = async () => {
    if (!chat?.userId || !adminId || !newNoteContent.trim() || saving) return;
    if (newNoteContent.length > MAX_NOTE_LENGTH) return;

    setSaving(true);
    try {
      await createNote(chat.userId, newNoteContent, adminId);
      setNewNoteContent('');
    } catch (err) {
      console.error('Failed to create note:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (note: AdminNote) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent('');
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!chat?.userId || !editingContent.trim() || saving) return;
    if (editingContent.length > MAX_NOTE_LENGTH) return;

    setSaving(true);
    try {
      await updateNote(chat.userId, noteId, editingContent);
      setEditingNoteId(null);
      setEditingContent('');
    } catch (err) {
      console.error('Failed to update note:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!chat?.userId || saving) return;
    if (!confirm('Are you sure you want to delete this note?')) return;

    setSaving(true);
    try {
      await deleteNote(chat.userId, noteId);
    } catch (err) {
      console.error('Failed to delete note:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!chat) {
    return (
      <div className="w-[317px] h-full bg-white border-l border-[#F3F3F3] p-6">
        <div className="text-sm text-[#757285]">
          Select a chat to view details
        </div>
      </div>
    );
  }

  return (
    <div className="w-[317px] h-full bg-white border-l border-[#F3F3F3] overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-[#F3F3F3] flex items-center">
        <div className="flex items-center gap-2">
          <Avatar userId={chat?.userId || null} size="sm" />
          <div className="text-sm font-semibold">{nameToShow}</div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="p-6 space-y-4">
        <div>
          <div className="text-xs font-semibold text-[#777583] mb-1">ID</div>
          <div className="text-xs font-semibold text-black">{chat.id}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-[#777583] mb-1">
            Phone num.
          </div>
          <div className="text-xs font-semibold text-black">
            {loading ? (
              <span className="text-[#777583]">Loading...</span>
            ) : error ? (
              <span className="text-[#777583]">N/A</span>
            ) : (
              user?.phoneNumber || 'N/A'
            )}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-[#777583] mb-1">Email</div>
          <div className="text-xs font-semibold text-black">
            {loading ? (
              <span className="text-[#777583]">Loading...</span>
            ) : error ? (
              <span className="text-[#777583]">N/A</span>
            ) : (
              user?.email || 'N/A'
            )}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-[#777583] mb-1">
            Account
          </div>
          <div className="text-xs font-semibold text-black">
            {loading ? (
              <span className="text-[#777583]">Loading...</span>
            ) : error ? (
              <span className="text-[#777583]">N/A</span>
            ) : (
              user?.accountNumber || 'N/A'
            )}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-[#777583] mb-1">
            Created At
          </div>
          <div className="text-xs font-semibold text-black">
            {loading ? (
              <span className="text-[#777583]">Loading...</span>
            ) : error ? (
              <span className="text-[#777583]">N/A</span>
            ) : user?.createdAt ? (
              user.createdAt.toLocaleString()
            ) : (
              'N/A'
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[#F1F1F1]"></div>

      {/* Notes */}
      <div className="p-6 space-y-4">
        <div className="text-xs font-semibold text-[#777583]">Notes</div>

        {/* Add New Note */}
        <div className="space-y-2">
          <Textarea
            value={newNoteContent}
            onChange={e => setNewNoteContent(e.target.value)}
            placeholder="Write a note..."
            className="min-h-[81px] bg-[#FAFAFA] border-[#EEEEEE] rounded-lg resize-none"
            maxLength={MAX_NOTE_LENGTH}
            disabled={saving || !adminId}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#777583]">
              {newNoteContent.length}/{MAX_NOTE_LENGTH}
            </span>
            <Button
              onClick={handleCreateNote}
              disabled={
                !newNoteContent.trim() ||
                newNoteContent.length > MAX_NOTE_LENGTH ||
                saving ||
                !adminId
              }
              size="sm"
              className="h-7 px-2 text-xs font-semibold bg-[#D44928] hover:bg-[#D44928]/90 text-white"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Notes List */}
        {notesLoading ? (
          <div className="text-xs text-[#777583]">Loading notes...</div>
        ) : notesError ? (
          <div className="text-xs text-destructive">
            Error loading notes: {notesError.message}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-xs text-[#777583]">No notes yet</div>
        ) : (
          <div className="space-y-3">
            {notes.map(note => {
              const isEditable = note.createdBy === adminId;
              const isEditing = editingNoteId === note.id;

              return (
                <div
                  key={note.id}
                  className="p-3 bg-[#FAFAFA] rounded-lg border border-[#EEEEEE]"
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingContent}
                        onChange={e => setEditingContent(e.target.value)}
                        className="min-h-[60px] bg-white resize-none"
                        maxLength={MAX_NOTE_LENGTH}
                        disabled={saving}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#777583]">
                          {editingContent.length}/{MAX_NOTE_LENGTH}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={handleCancelEdit}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleUpdateNote(note.id)}
                            size="sm"
                            className="h-6 px-2 text-xs bg-[#D44928] hover:bg-[#D44928]/90 text-white"
                            disabled={
                              !editingContent.trim() ||
                              editingContent.length > MAX_NOTE_LENGTH ||
                              saving ||
                              editingContent === note.content
                            }
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs font-semibold text-black mb-2">
                        {note.content}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-[#777583]">
                          {note.updatedAt
                            ? `Updated ${note.updatedAt.toLocaleString()}`
                            : `Created ${note.createdAt.toLocaleString()}`}
                        </div>
                        {isEditable && (
                          <div className="flex items-center gap-1">
                            <Button
                              onClick={() => handleStartEdit(note)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-gray-200 transition-colors"
                              disabled={saving}
                            >
                              <Edit2 className="w-3 h-3 text-[#777583]" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteNote(note.id)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-gray-200 transition-colors"
                              disabled={saving}
                            >
                              <Trash2 className="w-3 h-3 text-[#777583]" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
