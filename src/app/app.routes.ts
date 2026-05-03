import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CreateParcheComponent } from './components/create-parche/create-parche.component';

export const routes: Routes = [
  { path: '',      redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreateParcheComponent },
  { path: 'home', redirectTo: 'create', pathMatch: 'full' },
];
