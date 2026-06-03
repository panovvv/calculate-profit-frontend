import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { ProfitPageComponent } from './features/profit/profit-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'profit', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Sign in' },
  {
    path: 'profit',
    component: ProfitPageComponent,
    canActivate: [authGuard],
    title: 'Calculate Profit',
  },
];
