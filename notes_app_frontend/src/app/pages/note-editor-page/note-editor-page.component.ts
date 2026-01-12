import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { NoteEditorComponent } from '../../components/note-editor/note-editor.component';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-editor-page',
  standalone: true,
  imports: [CommonModule, NoteEditorComponent],
  templateUrl: './note-editor-page.component.html',
})
export class NoteEditorPageComponent {
  private readonly notesService = inject(NotesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  note: Note | null = null;
  private noteId: string | null = null;

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pm) => {
        this.noteId = pm.get('id');
        if (!this.noteId) {
          this.note = null;
          return;
        }

        this.notesService
          .getById$(this.noteId)
          .pipe(
            filter(() => !!this.noteId),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe((n) => (this.note = n ?? null));
      });
  }

  onTitleChange = (value: string) => {
    if (!this.noteId) return;
    this.notesService.update(this.noteId, { title: value });
  };

  onContentChange = (value: string) => {
    if (!this.noteId) return;
    this.notesService.update(this.noteId, { content: value });
  };

  onTagsChange = (value: string[]) => {
    if (!this.noteId) return;
    this.notesService.update(this.noteId, { tags: value });
  };

  onDelete = () => {
    if (!this.noteId) return;
    this.notesService.delete(this.noteId);
    this.router.navigate(['/notes']);
  };
}
