import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-health-bar',
  templateUrl: './health-bar.component.html',
  styleUrl: './health-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthBarComponent {

  // #region Constants
  // #endregion

  // #region Inputs & Outputs

  readonly active = input.required<number>();
  readonly total = input.required<number>();

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

  /** Unicode block-character progress string (8 segments). */
  protected readonly blocks = computed(() => {
    if (this.total() === 0) return '░░░░░░░░';
    const filled = Math.round((this.active() / this.total()) * 8);
    return '█'.repeat(filled) + '░'.repeat(8 - filled);
  });

  /** Visual level based on percentage thresholds. */
  protected readonly level = computed(() => {
    const p = this.percent();
    return p >= 70 ? 'good' : p >= 40 ? 'warning' : 'bad';
  });

  /** Percentage of active services (0–100). */
  protected readonly percent = computed(() =>
    this.total() > 0 ? Math.round((this.active() / this.total()) * 100) : 0,
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
