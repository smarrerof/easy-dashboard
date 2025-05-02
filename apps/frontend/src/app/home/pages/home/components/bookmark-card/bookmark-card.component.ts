import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Bookmark } from '@app/home/models/bookmark';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-bookmark-card',
  imports: [TagComponent],
  templateUrl: './bookmark-card.component.html',
  styleUrl: './bookmark-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkCardComponent {
  @Input() bookmark!: Bookmark;
  @Input() selectedTags!: string[];

  @Output() tagClicked = new EventEmitter<string>();

  onTagClicked(tag: string): void {
    this.tagClicked.emit(tag);
  }
}
