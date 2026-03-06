import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { Server } from '../../models/dashboard.models';
import { HealthBarComponent } from '../health-bar/health-bar.component';
import { CategorySectionComponent } from '../category-section/category-section.component';

@Component({
  selector: 'app-server-card',
  imports: [HealthBarComponent, CategorySectionComponent],
  templateUrl: './server-card.component.html',
  styleUrl: './server-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerCardComponent {
  readonly server = input.required<Server>();
  /** When true, shows all categories inline (desktop). When false, card is clickable. */
  readonly expanded = input(false);

  readonly selected = output<Server>();

  protected readonly activeCount = computed(() => Server.getActiveServiceCount(this.server()));
  protected readonly totalCount = computed(() => Server.getTotalServiceCount(this.server()));
}
