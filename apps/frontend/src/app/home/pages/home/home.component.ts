import { Component, OnInit } from '@angular/core';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/bookmark';

@Component({
  selector: 'app-home',
  imports: [],
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
