import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'easy-dashboard-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly _theme = signal<Theme>(this.getInitialTheme());
  readonly theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      const t = this._theme();
      this.document.documentElement.setAttribute('data-theme', t);
      (this.document.defaultView as Window | null)?.localStorage.setItem(STORAGE_KEY, t);
    });
  }

  /** Toggles between dark and light theme. */
  toggle(): void {
    this._theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  /** Reads stored preference or system preference to determine the initial theme. */
  private getInitialTheme(): Theme {
    const win = this.document.defaultView as Window | null;
    const stored = win?.localStorage.getItem(STORAGE_KEY) ?? null;
    if (stored === 'dark' || stored === 'light') return stored;
    return win?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
