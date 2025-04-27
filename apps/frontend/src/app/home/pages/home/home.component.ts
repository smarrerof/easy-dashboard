import { Component, OnInit } from '@angular/core';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/bookmark';
import { BookmarkCardComponent } from './components/bookmark-card/bookmark-card.component';

@Component({
  selector: 'app-home',
  imports: [BookmarkCardComponent],
  providers: [BookmarkService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  bookmarks!: Bookmark[];

  constructor(private bookmarkService: BookmarkService) {}

  ngOnInit(): void {
    this.bookmarkService.get().subscribe((bookmarks) => {
      this.bookmarks = bookmarks;
    });
  }
}
