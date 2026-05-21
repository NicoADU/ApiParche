import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CreateParcheComponent } from './components/create-parche/create-parche.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { JoinParcheComponent } from './components/join-parche/join-parche.component';
import { ParcheDetailComponent } from './components/parche-detail/parche-detail.component';
import { MembersComponent } from './components/members/members.component';
import { CreatePlanComponent } from './components/create-plan/create-plan.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'create-parche', component: CreateParcheComponent },
  { path: 'join-parche', component: JoinParcheComponent },
  { path: 'parche-detail/:id', component: ParcheDetailComponent },
  { path: 'members/:id', component: MembersComponent },
  { path: 'create-plan/:parcheId', component: CreatePlanComponent },
  { path: '**', redirectTo: 'login' }
];
