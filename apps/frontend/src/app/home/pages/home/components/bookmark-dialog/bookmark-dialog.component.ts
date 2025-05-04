import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Bookmark } from '@app/home/models/bookmark';

class BookmarkModel {
  id: number;
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  tags: string;

  constructor() {
    this.id = 0;
    this.name = '';
    this.description = '';
    this.url = '';
    this.icon = '';
    this.color = '#ffffff';
    this.tags = '';
  }

  static from(bookmark: Bookmark): BookmarkModel {
    const bookmarkModel = new BookmarkModel();
    bookmarkModel.id = bookmark.id;
    bookmarkModel.name = bookmark.name;
    bookmarkModel.description = bookmark.description;
    bookmarkModel.url = bookmark.url;
    bookmarkModel.icon = bookmark.icon;
    bookmarkModel.color = bookmark.color;
    bookmarkModel.tags = bookmark.tags.join(',');
    return bookmarkModel;
  }

  to(): Bookmark {
    const bookmark: Bookmark = {
      id: this.id,
      name: this.name,
      description: this.description,
      url: this.url,
      icon: this.icon,
      color: this.color,
      tags: this.tags.split(',').map((tag) => tag.trim()),
      isActive: true,
      visits: 0,
    };
    return bookmark;
  }
}

@Component({
  selector: 'app-bookmark-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './bookmark-dialog.component.html',
  styleUrl: './bookmark-dialog.component.scss',
})
export class BookmarkDialogComponent {
  @Output() acceptDialog = new EventEmitter<Bookmark>();
  @Output() closeDialog = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      icon: [''],
      color: ['#ffffff'],
      tags: [''],
    });
  }

  onAcceptClicked(): void {
    if (this.form.valid) {
      const bookmarkModel = new BookmarkModel();
      Object.assign(bookmarkModel, this.form.getRawValue());
      this.acceptDialog.emit(bookmarkModel.to());
    }
  }

  onCloseClicked(): void {
    this.closeDialog.emit();
  }

  isError(controlName: string): boolean {
    return (
      (this.form.get(controlName)?.invalid &&
        (this.form.get(controlName)?.touched || this.form.get(controlName)?.dirty)) ??
      false
    );
  }
}
