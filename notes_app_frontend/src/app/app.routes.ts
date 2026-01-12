import { Routes } from '@angular/router';
import { NotesShellComponent } from './pages/notes-shell/notes-shell.component';
import { EmptyEditorComponent } from './pages/empty-editor/empty-editor.component';
import { NoteEditorPageComponent } from './pages/note-editor-page/note-editor-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'notes' },
  {
    path: 'notes',
    component: NotesShellComponent,
    children: [
      { path: '', component: EmptyEditorComponent },
      { path: ':id', component: NoteEditorPageComponent },
    ],
  },
  { path: '**', redirectTo: 'notes' },
];
