import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'registro',
    pathMatch: 'full',
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then((m) => Object.values(m)[0] as any),
  },
  {
    path: 'driven',
    loadComponent: () => import('./driven/driven.page').then((m) => m.DrivenPage),
  },
  {
    path: 'driven',
    loadComponent: () => import('./driven/driven.page').then( m => m.DrivenPage)
  },
];