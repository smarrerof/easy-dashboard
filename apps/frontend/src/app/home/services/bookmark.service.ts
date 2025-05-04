import { Injectable } from '@angular/core';
import { Bookmark } from '../models/bookmark';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable()
export class BookmarkService {
  bookmarks: Bookmark[] = [
    {
      id: 1,
      name: 'Plex',
      url: 'http://localhost:32400',
      icon: 'si-plex',
      color: 'rgb(255, 179, 0)', // Plex yellow
      description: 'Media server',
      tags: ['media', 'server'],
      isActive: true,
      visits: 120,
    },
    {
      id: 2,
      name: 'AdGuard',
      url: 'http://localhost:3000',
      icon: 'si-adguard',
      color: 'rgb(0, 166, 82)', // AdGuard green
      description: 'Ad blocker and privacy protection',
      tags: ['network', 'privacy'],
      isActive: true,
      visits: 85,
    },
    {
      id: 3,
      name: 'Sonarr',
      url: 'http://localhost:8989',
      icon: 'si-sonarr',
      color: 'rgb(0, 122, 204)', // Sonarr blue
      description: 'TV show management',
      tags: ['media', 'tv'],
      isActive: false,
      visits: 60,
    },
    {
      id: 4,
      name: 'Radarr',
      url: 'http://localhost:7878',
      icon: 'si-radarr',
      color: 'rgb(0, 122, 204)', // Radarr blue
      description: 'Movie management',
      tags: ['media', 'movies'],
      isActive: false,
      visits: 45,
    },
    {
      id: 5,
      name: 'Tautulli',
      url: 'http://localhost:8181',
      icon: 'si-tautulli',
      color: 'rgb(255, 102, 0)', // Tautulli orange
      description: 'Plex usage monitoring',
      tags: ['media', 'monitoring'],
      isActive: false,
      visits: 30,
    },
    {
      id: 6,
      name: 'qBittorrent',
      url: 'http://localhost:8080',
      icon: 'si-qbittorrent',
      color: 'rgb(38, 139, 210)', // qBittorrent blue
      description: 'Torrent client',
      tags: ['downloads', 'torrent'],
      isActive: true,
      visits: 75,
    },
    {
      id: 7,
      name: 'Home Assistant',
      url: 'http://localhost:8123',
      icon: 'si-homeassistant',
      color: 'rgb(0, 150, 136)', // Home Assistant teal
      description: 'Home automation platform',
      tags: ['automation', 'home'],
      isActive: true,
      visits: 95,
    },
    {
      id: 8,
      name: 'Portainer',
      url: 'http://localhost:9000',
      icon: 'si-portainer',
      color: 'rgb(0, 123, 255)', // Portainer blue
      description: 'Docker container management',
      tags: ['devops', 'docker'],
      isActive: true,
      visits: 50,
    },
  ];

  get(): Observable<Bookmark[]> {
    const bookmarks = [...this.bookmarks];
    return of(bookmarks);
  }

  add(bookmark: Bookmark): Observable<Bookmark> {
    const newId = Math.max(...this.bookmarks.map((b) => b.id), 0) + 1;
    const newBookmark = { ...bookmark, id: newId, visits: 0 };
    this.bookmarks.push(newBookmark);
    return of(newBookmark);
  }
}
