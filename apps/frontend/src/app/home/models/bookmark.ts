export interface Bookmark {
  id: number;
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  tags: string[];
  isActive: boolean;
  visits: number;
}
