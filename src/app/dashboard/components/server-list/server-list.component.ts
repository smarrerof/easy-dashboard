import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { Server } from '../../models/dashboard.models';
import { ServerCardComponent } from '../server-card/server-card.component';

@Component({
  selector: 'app-server-list',
  imports: [ServerCardComponent],
  templateUrl: './server-list.component.html',
  styleUrl: './server-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerListComponent {

  // #region Constants
  // #endregion

  // #region Inputs & Outputs

  readonly isDesktop = input.required<boolean>();
  readonly servers = input.required<Server[]>();

  readonly serverSelected = output<Server>();

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
