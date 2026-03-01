import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { Service } from '../../models/dashboard.models';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCardComponent {
  readonly service = input.required<Service>();
  readonly compact = input(false);

  /** Full URL including port. */
  protected readonly fullUrl = computed(
    () => `${this.service().url}:${this.service().port}`,
  );
}
