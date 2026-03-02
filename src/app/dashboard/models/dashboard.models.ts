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
  updatedAt: string;
  servers: Server[];
}
