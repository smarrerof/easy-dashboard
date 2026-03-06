import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { Service } from '../../models/dashboard.models';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCardComponent {

  // #region Constants
  // #endregion

  // #region Inputs & Outputs

  readonly compact = input(false);
  readonly service = input.required<Service>();

  // #endregion

  // #region View Queries
  // #endregion

  // #region Dependencies
  // #endregion

  // #region Fields
  // #endregion

  // #region Properties
  // #endregion

  // #region State
  // #endregion

  // #region Computed

  /** Full URL including port. */
  protected readonly fullUrl = computed(
    () => `${this.service().url}:${this.service().port}`,
  );

  // #endregion

  constructor() {}

  // #region Lifecycle
  // #endregion

  // #region Event Handlers
  // #endregion

  // #region Public Methods
  // #endregion

  // #region Private Helpers
  // #endregion
}
