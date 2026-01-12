import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.css',
})
export class NoteEditorComponent {
  @Input() note: Note | null = null;

  @Input() onTitleChange: (value: string) => void = () => {};
  @Input() onContentChange: (value: string) => void = () => {};
  @Input() onTagsChange: (value: string[]) => void = () => {};
  @Input() onDelete: () => void = () => {};

  tagsText(note: Note): string {
    return (note.tags ?? []).join(', ');
  }

  parseTags(text: string): string[] {
    return text
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 20);
  }
}
