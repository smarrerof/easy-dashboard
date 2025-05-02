import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  @Input() selected!: boolean;
  @Input() tag!: string;

  @Output() tagClicked = new EventEmitter<string>();

  onTagClicked(): void {
    this.tagClicked.emit(this.tag);
  }
}
