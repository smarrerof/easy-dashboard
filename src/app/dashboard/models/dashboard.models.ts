export interface Service {
  id: string;
  name: string;
  description: string;
  url: string;
  port: number;
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  services: Service[];
}

export interface Server {
  id: string;
  name: string;
  host: string;
  location: string;
  categories: Category[];
}

export interface Dashboard {
  version: number;
  servers: Server[];
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Server {
  /** Returns the count of active services across all categories. */
  export function getActiveServiceCount(server: Server): number {
    return server.categories.flatMap((c) => c.services).filter((s) => s.status === 'active').length;
  }

  /** Returns the total count of services across all categories. */
  export function getTotalServiceCount(server: Server): number {
    return server.categories.flatMap((c) => c.services).length;
  }
}
