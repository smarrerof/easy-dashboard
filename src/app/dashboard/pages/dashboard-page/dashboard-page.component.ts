import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  type OnInit,
  inject,
  signal,
} from '@angular/core';

import type { Server } from '../../models/dashboard.models';
import { DashboardService } from '../../services/dashboard.service';
import { ServerListComponent } from '../../components/server-list/server-list.component';
import { ServerDetailComponent } from '../../components/server-detail/server-detail.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [ServerListComponent, ServerDetailComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  protected readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  protected readonly selectedServer = signal<Server | null>(null);
  protected readonly isDesktop = signal(false);

  constructor() {
    const mq = (this.document.defaultView as Window | null)?.matchMedia('(min-width: 768px)');
    if (!mq) return;

    this.isDesktop.set(mq.matches);

    const listener = (e: MediaQueryListEvent) => {
      this.isDesktop.set(e.matches);
      if (e.matches) this.selectedServer.set(null);
    };

    mq.addEventListener('change', listener);
    this.destroyRef.onDestroy(() => mq.removeEventListener('change', listener));
  }

  async ngOnInit(): Promise<void> {
    await this.dashboardService.load();
    this.dashboardService.startPolling(this.destroyRef);
  }

  /** Navigates to the detail view for the given server (mobile only). */
  protected selectServer(server: Server): void {
    this.selectedServer.set(server);
  }

  /** Returns to the server list view. */
  protected goBack(): void {
    this.selectedServer.set(null);
  }

  /** Retries loading the dashboard after an error. */
  protected retry(): void {
    this.dashboardService.load();
  }
}
