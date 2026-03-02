import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-health-bar',
  templateUrl: './health-bar.component.html',
  styleUrl: './health-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthBarComponent {
  readonly active = input.required<number>();
  readonly total = input.required<number>();

  /** Percentage of active services (0–100). */
  protected readonly percent = computed(() =>
    this.total() > 0 ? Math.round((this.active() / this.total()) * 100) : 0,
  );

  /** Visual level based on percentage thresholds. */
  protected readonly level = computed(() => {
    const p = this.percent();
    return p >= 70 ? 'good' : p >= 40 ? 'warning' : 'bad';
  });

  /** Unicode block-character progress string (8 segments). */
  protected readonly blocks = computed(() => {
    if (this.total() === 0) return '░░░░░░░░';
    const filled = Math.round((this.active() / this.total()) * 8);
    return '█'.repeat(filled) + '░'.repeat(8 - filled);
  });
}
