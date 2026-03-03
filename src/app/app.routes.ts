import { type Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './dashboard/pages/dashboard-page/dashboard-page.component'
      ).then((m) => m.DashboardPageComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found-page.component').then(
        (m) => m.NotFoundPageComponent,
      ),
  },
];
