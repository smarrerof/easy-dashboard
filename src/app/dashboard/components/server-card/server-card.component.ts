import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { Server } from '../../models/dashboard.models';
import { CategorySectionComponent } from '../category-section/category-section.component';
import { HealthBarComponent } from '../health-bar/health-bar.component';

@Component({
  selector: 'app-server-card',
  imports: [HealthBarComponent, CategorySectionComponent],
  templateUrl: './server-card.component.html',
  styleUrl: './server-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerCardComponent {

  // #region Constants
  // #endregion

  // #region Inputs & Outputs

  /** When true, shows all categories inline (desktop). When false, card is clickable. */
  readonly expanded = input(false);
  readonly server = input.required<Server>();

  readonly selected = output<Server>();

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

  protected readonly activeCount = computed(() => Server.getActiveServiceCount(this.server()));
  protected readonly totalCount = computed(() => Server.getTotalServiceCount(this.server()));

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
