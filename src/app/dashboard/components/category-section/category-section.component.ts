import { ChangeDetectionStrategy, Component, OnInit, input, signal } from '@angular/core';

import type { Category } from '../../models/dashboard.models';
import { ServiceCardComponent } from '../service-card/service-card.component';

@Component({
  selector: 'app-category-section',
  imports: [ServiceCardComponent],
  templateUrl: './category-section.component.html',
  styleUrl: './category-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySectionComponent implements OnInit {
  readonly category = input.required<Category>();
  readonly compact = input(false);
  readonly collapsible = input(false);
  readonly defaultExpanded = input(true);

  protected readonly isExpanded = signal(true);

  ngOnInit(): void {
    this.isExpanded.set(this.defaultExpanded());
  }

  /** Toggles the collapsed/expanded state of this section. */
  protected toggle(): void {
    this.isExpanded.update((v) => !v);
  }
}
