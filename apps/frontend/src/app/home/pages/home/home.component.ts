import { Component, OnInit } from '@angular/core';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/bookmark';
import { BookmarkCardComponent } from './components/bookmark-card/bookmark-card.component';
import { TagComponent } from './components/tag/tag.component';

@Component({
  selector: 'app-home',
  imports: [BookmarkCardComponent, TagComponent],
  providers: [BookmarkService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  bookmarks!: Bookmark[];
  filteredBookmarks!: Bookmark[];
  selectedTags: string[] = [];
  tags!: string[];

  constructor(private bookmarkService: BookmarkService) {}

  ngOnInit(): void {
    this.bookmarkService.get().subscribe((bookmarks) => {
      this.tags = Array.from(new Set(bookmarks.flatMap((bookmark) => bookmark.tags))).sort();

      this.bookmarks = bookmarks;
      this.filteredBookmarks = bookmarks;
    });
  }

  filterByTag(tag: string): void {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = [...this.selectedTags.filter((t) => t !== tag)];
    } else {
      this.selectedTags = [tag, ...this.selectedTags];
    }

    if (this.selectedTags.length > 0) {
      this.filteredBookmarks = [
        ...this.bookmarks.filter((bookmark) => this.selectedTags.some((tag) => bookmark.tags.includes(tag))),
      ];
    } else {
      this.filteredBookmarks = [...this.bookmarks];
    }
  }
}
