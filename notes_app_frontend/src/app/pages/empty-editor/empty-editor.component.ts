import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteEditorComponent } from '../../components/note-editor/note-editor.component';

@Component({
  selector: 'app-empty-editor',
  standalone: true,
  imports: [CommonModule, NoteEditorComponent],
  template: `<app-note-editor [note]="null" />`,
})
export class EmptyEditorComponent {}
