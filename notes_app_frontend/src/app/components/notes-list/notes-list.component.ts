import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css',
})
export class NotesListComponent {
  @Input({ required: true }) notes: Note[] = [];
  @Input() selectedId: string | null = null;

  @Input() onDelete: (id: string) => void = () => {};
}
