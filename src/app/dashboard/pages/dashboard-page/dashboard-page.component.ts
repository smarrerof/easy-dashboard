import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  type OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import type { Server } from '../../models/dashboard.models';
import { DashboardService } from '../../services/dashboard.service';
import { ServerListComponent } from '../../components/server-list/server-list.component';
import { ServerDetailComponent } from '../../components/server-detail/server-detail.component';

type View = { type: 'list' } | { type: 'detail'; server: Server };

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

  protected readonly view = signal<View>({ type: 'list' });
  protected readonly isDesktop = signal(false);

  protected readonly selectedServer = computed((): Server | null => {
    const v = this.view();
    return v.type === 'detail' ? v.server : null;
  });

  constructor() {
    const mq = window.matchMedia('(min-width: 768px)');
    this.isDesktop.set(mq.matches);

    const listener = (e: MediaQueryListEvent) => {
      this.isDesktop.set(e.matches);
      if (e.matches) this.view.set({ type: 'list' });
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
    this.view.set({ type: 'detail', server });
  }

  /** Returns to the server list view. */
  protected goBack(): void {
    this.view.set({ type: 'list' });
  }
}
