import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [publicGuard()],
        loadChildren: () => import('./auth/features/shell/auth.routes'),
    },
    {
        path: 'dashboard',
        canActivate: [privateGuard()],
        loadComponent: () => import('./dashboard/dashboard.component'),
    },
    {
        path: 'recomendaciones',
        canActivate: [privateGuard()],
        loadComponent: () => import('./recomendaciones/recomendaciones.component'),
    },
    {
        path: 'soporte',
        canActivate: [privateGuard()],
        loadComponent: () => import('./soporte/soporte.component'),
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
