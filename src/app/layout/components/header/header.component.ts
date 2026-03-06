import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
  private readonly document = inject(DOCUMENT);

  /** Reads the app version from the runtime config injected by the Docker entrypoint, prefixed with "v" unless it is "dev". */
  protected readonly appVersion = computed(() => {
    const v = (this.document.defaultView as Window | null)?.APP_CONFIG?.appVersion ?? 'dev';
    return v === 'dev' ? 'dev' : `v${v}`;
  });
}
