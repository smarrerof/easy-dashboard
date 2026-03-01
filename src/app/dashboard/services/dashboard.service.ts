import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { parse } from 'yaml';

import type { Dashboard, Server, Category, Service } from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  readonly dashboard = signal<Dashboard | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  /** Fetches and parses the dashboard YAML, updating reactive signals. */
  async load(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const text = await firstValueFrom(
        this.http.get('/dashboard.yaml', { responseType: 'text' }),
      );
      this.dashboard.set(this.parseDashboard(parse(text)));
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      this.isLoading.set(false);
    }
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
    if (typeof raw['updatedAt'] !== 'string')
      throw new Error('dashboard.updatedAt: must be a string');
    if (!Array.isArray(raw['servers']))
      throw new Error('dashboard.servers: must be an array');

    return {
      version: raw['version'],
      updatedAt: raw['updatedAt'],
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

    const service: Service = {
      id: raw['id'],
      name: raw['name'],
      description: raw['description'],
      url: raw['url'],
      port: raw['port'],
      status: raw['status'],
    };

    if (raw['tags'] !== undefined) {
      if (!Array.isArray(raw['tags']) || !raw['tags'].every((t) => typeof t === 'string'))
        throw new Error(`${path}.tags: must be a string array`);
      service.tags = raw['tags'];
    }

    return service;
  }
}
