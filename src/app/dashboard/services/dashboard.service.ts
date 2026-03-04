import { Injectable, inject, signal, type DestroyRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { parse } from 'yaml';

import type { Dashboard, Server, Category, Service } from '../models/dashboard.models';

interface AppConfig {
  reloadInterval: number;
  appVersion?: string;
}

declare global {
  interface Window {
    APP_CONFIG?: AppConfig;
  }
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  readonly dashboard = signal<Dashboard | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notification = signal<{ type: 'info' | 'warn'; message: string } | null>(null);

  private notificationTimer: ReturnType<typeof setTimeout> | null = null;
  private lastYaml: string | null = null;

  /** Reads the poll interval (in seconds) from window.APP_CONFIG, defaulting to 30. Set to 0 to disable polling. */
  private get pollInterval(): number {
    return window.APP_CONFIG?.reloadInterval ?? 30;
  }

  /** Fetches and parses the dashboard YAML, updating reactive signals. */
  async load(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const text = await firstValueFrom(
        this.http.get('/dashboard.yaml', { responseType: 'text' }),
      );
      let parsed: unknown;
      try {
        parsed = parse(text);
      } catch {
        throw new Error('dashboard.yaml has invalid YAML syntax — check the file for formatting errors.');
      }
      this.lastYaml = text;
      this.dashboard.set(this.parseDashboard(parsed));
    } catch (err) {
      this.error.set(this.toErrorMessage(err));
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Starts periodic polling for dashboard.yaml changes and stops on destroy.
   * Does nothing if pollInterval is 0 (polling disabled).
   * @param destroyRef Used to clear the interval when the component is destroyed.
   */
  startPolling(destroyRef: DestroyRef): void {
    if (this.pollInterval === 0) return;
    const intervalId = setInterval(() => this.poll(), this.pollInterval * 1000);
    destroyRef.onDestroy(() => clearInterval(intervalId));
  }

  /** Silently fetches dashboard.yaml and updates the dashboard signal if the content changed. */
  private async poll(): Promise<void> {
    try {
      const text = await firstValueFrom(
        this.http.get('/dashboard.yaml', { responseType: 'text' }),
      );
      if (this.lastYaml === text) return;
      this.lastYaml = text;
      let parsed: unknown;
      try {
        parsed = parse(text);
      } catch {
        this.showNotification('warn', 'dashboard.yaml has invalid YAML syntax.');
        return;
      }
      this.dashboard.set(this.parseDashboard(parsed));
      this.showNotification('info', 'dashboard.yaml updated.');
    } catch (err) {
      this.showNotification('warn', this.toErrorMessage(err));
    }
  }

  /**
   * Shows a notification banner and clears it after 5 seconds.
   * @param type    Severity level of the notification.
   * @param message Human-readable message to display.
   */
  private showNotification(type: 'info' | 'warn', message: string): void {
    if (this.notificationTimer !== null) {
      clearTimeout(this.notificationTimer);
    }
    this.notification.set({ type, message });
    this.notificationTimer = setTimeout(() => this.notification.set(null), 5000);
  }

  /** Maps a caught error to a human-readable message. */
  private toErrorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 404) return 'dashboard.yaml not found — place the file in the data/ folder.';
      return `Server error ${err.status}: ${err.statusText}`;
    }
    return err instanceof Error ? err.message : 'Unknown error';
  }

  /** Returns true if `value` is a non-null, non-array object. */
  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /** Validates the root dashboard object and returns a typed `Dashboard`. */
  private parseDashboard(raw: unknown): Dashboard {
    if (!this.isRecord(raw)) throw new Error('dashboard: expected an object at root');

    if (typeof raw['version'] !== 'number')
      throw new Error('dashboard.version: must be a number');
    if (!Array.isArray(raw['servers']))
      throw new Error('dashboard.servers: must be an array');

    return {
      version: raw['version'],
      servers: raw['servers'].map((s, i) => this.parseServer(s, i)),
    };
  }

  /**
   * Validates a raw server entry and returns a typed `Server`.
   * @param index Position in the servers array, used in error messages.
   */
  private parseServer(raw: unknown, index: number): Server {
    const path = `dashboard.servers[${index}]`;
    if (!this.isRecord(raw)) throw new Error(`${path}: expected an object`);

    if (typeof raw['id'] !== 'string') throw new Error(`${path}.id: must be a string`);
    if (typeof raw['name'] !== 'string') throw new Error(`${path}.name: must be a string`);
    if (typeof raw['host'] !== 'string') throw new Error(`${path}.host: must be a string`);
    if (typeof raw['location'] !== 'string') throw new Error(`${path}.location: must be a string`);
    if (!Array.isArray(raw['categories'])) throw new Error(`${path}.categories: must be an array`);

    const id = raw['id'];
    return {
      id,
      name: raw['name'],
      host: raw['host'],
      location: raw['location'],
      categories: raw['categories'].map((c, i) => this.parseCategory(c, id, i)),
    };
  }

  /**
   * Validates a raw category entry and returns a typed `Category`.
   * @param serverId Parent server id, used in error messages.
   * @param index    Position in the categories array, used in error messages.
   */
  private parseCategory(raw: unknown, serverId: string, index: number): Category {
    const path = `servers[${serverId}].categories[${index}]`;
    if (!this.isRecord(raw)) throw new Error(`${path}: expected an object`);

    if (typeof raw['id'] !== 'string') throw new Error(`${path}.id: must be a string`);
    if (typeof raw['name'] !== 'string') throw new Error(`${path}.name: must be a string`);
    if (!Array.isArray(raw['services'])) throw new Error(`${path}.services: must be an array`);

    const id = raw['id'];
    return {
      id,
      name: raw['name'],
      services: raw['services'].map((s, i) => this.parseService(s, id, i)),
    };
  }

  /**
   * Validates a raw service entry and returns a typed `Service`.
   * @param categoryId Parent category id, used in error messages.
   * @param index      Position in the services array, used in error messages.
   */
  private parseService(raw: unknown, categoryId: string, index: number): Service {
    const path = `categories[${categoryId}].services[${index}]`;
    if (!this.isRecord(raw)) throw new Error(`${path}: expected an object`);

    if (typeof raw['id'] !== 'string') throw new Error(`${path}.id: must be a string`);
    if (typeof raw['name'] !== 'string') throw new Error(`${path}.name: must be a string`);
    if (typeof raw['description'] !== 'string')
      throw new Error(`${path}.description: must be a string`);
    if (typeof raw['url'] !== 'string') throw new Error(`${path}.url: must be a string`);
    if (typeof raw['port'] !== 'number') throw new Error(`${path}.port: must be a number`);
    if (raw['status'] !== 'active' && raw['status'] !== 'inactive')
      throw new Error(`${path}.status: must be "active" or "inactive"`);

    return {
      id: raw['id'],
      name: raw['name'],
      description: raw['description'],
      url: raw['url'],
      port: raw['port'],
      status: raw['status'],
    };
  }
}
