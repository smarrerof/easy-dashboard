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
  readonly servers = input.required<Server[]>();
  readonly isDesktop = input.required<boolean>();

  readonly serverSelected = output<Server>();
}
