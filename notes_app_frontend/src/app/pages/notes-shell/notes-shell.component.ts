import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NotesListComponent } from '../../components/notes-list/notes-list.component';

import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-notes-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, NotesListComponent],
  templateUrl: './notes-shell.component.html',
  styleUrl: './notes-shell.component.css',
})
export class NotesShellComponent {
  private readonly notesService = inject(NotesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  notes: Note[] = [];
  searchText = '';
  selectedId: string | null = null;

  constructor() {
    this.notesService
      .list$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notes) => (this.notes = notes));

    this.notesService
      .getSearchText$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((t) => (this.searchText = t));

    // Track selected note id from current child route (if any)
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const child = this.route.firstChild;
      this.selectedId = child?.snapshot.paramMap.get('id') ?? null;
    });
    // initial
    const child = this.route.firstChild;
    this.selectedId = child?.snapshot.paramMap.get('id') ?? null;
  }

  onSearchChange(text: string): void {
    this.notesService.setSearchText(text);
  }

  onCreateNote(): void {
    const id = this.notesService.create();
    this.router.navigate(['/notes', id]);
  }

  onDeleteNote(id: string): void {
    const wasSelected = this.selectedId === id;
    this.notesService.delete(id);

    if (wasSelected) {
      this.router.navigate(['/notes']);
    }
  }
}
