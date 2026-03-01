import { DOCUMENT } from '@angular/common';
import { Injectable, type WritableSignal, effect, inject, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'easy-dashboard-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly theme: WritableSignal<Theme>;

  constructor() {
    this.theme = signal<Theme>(this.getInitialTheme());

    effect(() => {
      const t = this.theme();
      this.document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem(STORAGE_KEY, t);
    });
  }

  /** Toggles between dark and light theme. */
  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  /**
   * Reads stored preference or system preference to determine the initial theme.
   */
  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
