import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import type { Server } from '../../models/dashboard.models';
import { HealthBarComponent } from '../health-bar/health-bar.component';
import { CategorySectionComponent } from '../category-section/category-section.component';

@Component({
  selector: 'app-server-detail',
  imports: [HealthBarComponent, CategorySectionComponent],
  templateUrl: './server-detail.component.html',
  styleUrl: './server-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerDetailComponent {
  readonly server = input.required<Server>();
  readonly back = output<void>();

  protected readonly activeCount = computed(
    () =>
      this.server()
        .categories.flatMap((c) => c.services)
        .filter((s) => s.status === 'active').length,
  );

  protected readonly totalCount = computed(
    () => this.server().categories.flatMap((c) => c.services).length,
  );
}
