import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DashboardService } from './dashboard/services/dashboard.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  protected title = 'easy-dashboard';

  private readonly dashboardService = inject(DashboardService);

  async ngOnInit(): Promise<void> {
    await this.dashboardService.load();
  }
}
