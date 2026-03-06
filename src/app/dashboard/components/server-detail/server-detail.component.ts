import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { Server } from '../../models/dashboard.models';
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

  protected readonly activeCount = computed(() => Server.getActiveServiceCount(this.server()));
  protected readonly totalCount = computed(() => Server.getTotalServiceCount(this.server()));
}
