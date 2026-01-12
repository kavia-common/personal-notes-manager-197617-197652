import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Note, NoteId } from '../models/note.model';
import { createId, nowIso } from '../shared/utils';

export interface NoteQuery {
  searchText: string;
}

/**
 * NotesService (in-memory).
 *
 * Future: replace internal store logic with HttpClient calls to `${apiBaseUrl}/notes`.
 */
@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly notes$ = new BehaviorSubject<Note[]>(this.seedNotes());
  private readonly query$ = new BehaviorSubject<NoteQuery>({ searchText: '' });

  // PUBLIC_INTERFACE
  setSearchText(searchText: string): void {
    /** Set the client-side search query. */
    this.query$.next({ ...this.query$.value, searchText });
  }

  // PUBLIC_INTERFACE
  getSearchText$(): Observable<string> {
    /** Observable of the current search text. */
    return this.query$.pipe(map((q) => q.searchText));
  }

  // PUBLIC_INTERFACE
  list$(): Observable<Note[]> {
    /** Observable list of notes filtered by current query. */
    return combineLatest([this.notes$, this.query$]).pipe(
      map(([notes, query]) => {
        const q = query.searchText.trim().toLowerCase();
        if (!q) return this.sortNotes(notes);

        return this.sortNotes(
          notes.filter((n) => {
            const haystack = `${n.title}\n${n.content}\n${(n.tags ?? []).join(' ')}`.toLowerCase();
            return haystack.includes(q);
          }),
        );
      }),
    );
  }

  // PUBLIC_INTERFACE
  getById$(id: NoteId): Observable<Note | undefined> {
    /** Observable for a single note by id. */
    return this.notes$.pipe(map((notes) => notes.find((n) => n.id === id)));
  }

  // PUBLIC_INTERFACE
  create(): NoteId {
    /** Create a new note and return its id. */
    const id = createId('note');
    const now = nowIso();
    const newNote: Note = {
      id,
      title: 'Untitled note',
      content: '',
      tags: [],
      createdAt: now,
      updatedAt: now,
    };

    this.notes$.next([newNote, ...this.notes$.value]);
    return id;
  }

  // PUBLIC_INTERFACE
  update(id: NoteId, patch: Partial<Pick<Note, 'title' | 'content' | 'tags'>>): void {
    /** Update an existing note. */
    const current = this.notes$.value;
    const idx = current.findIndex((n) => n.id === id);
    if (idx < 0) return;

    const updated: Note = {
      ...current[idx],
      ...patch,
      updatedAt: nowIso(),
    };

    const next = [...current];
    next[idx] = updated;
    this.notes$.next(next);
  }

  // PUBLIC_INTERFACE
  delete(id: NoteId): void {
    /** Delete a note by id. */
    this.notes$.next(this.notes$.value.filter((n) => n.id !== id));
  }

  private sortNotes(notes: Note[]): Note[] {
    // Sort most recently updated first
    return [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  private seedNotes(): Note[] {
    const now = nowIso();
    return [
      {
        id: 'note_welcome',
        title: 'Welcome to Ocean Notes',
        content:
          'This is a lightweight **markdown** editor.\n\n- Create notes\n- Search instantly\n- Edit in a clean, modern UI\n\nTip: Use `#` headings and `-` lists.',
        tags: ['welcome', 'markdown'],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'note_shortcuts',
        title: 'Quick ideas',
        content: 'Capture ideas fast.\n\n> Keep it simple. Keep it searchable.',
        tags: ['ideas'],
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
}
