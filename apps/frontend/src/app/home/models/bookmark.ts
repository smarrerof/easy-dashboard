export interface Bookmark {
  id: number;
  icon: string;
  color: string;
  name: string;
  description: string;
  url: string;
  tags: string[];
  isActive: boolean;
  visits: number;
}
