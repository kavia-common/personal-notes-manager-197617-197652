export type NoteId = string;

export interface Note {
  id: NoteId;
  title: string;
  /**
   * Markdown content (stored as plain text for now).
   * In the future, this can be changed to HTML or a rich-text delta.
   */
  content: string;
  tags: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
