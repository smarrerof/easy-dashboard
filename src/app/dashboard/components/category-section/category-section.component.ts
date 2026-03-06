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

  // #region Constants
  // #endregion

  // #region Inputs & Outputs

  readonly category = input.required<Category>();
  readonly collapsible = input(false);
  readonly compact = input(false);
  readonly defaultExpanded = input(true);

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

  protected readonly isExpanded = signal(true);

  // #endregion

  // #region Computed
  // #endregion

  constructor() {}

  // #region Lifecycle

  ngOnInit(): void {
    this.isExpanded.set(this.defaultExpanded());
  }

  // #endregion

  // #region Event Handlers

  /** Toggles the collapsed/expanded state of this section. */
  protected toggle(): void {
    this.isExpanded.update((v) => !v);
  }

  // #endregion

  // #region Public Methods
  // #endregion

  // #region Private Helpers
  // #endregion
}
