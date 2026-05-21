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
import { PlanDetailComponent } from './components/plan-detail/plan-detail.component';
import { RankingComponent } from './components/ranking/ranking.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'dashboard', redirectTo: 'home', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'create', component: CreateParcheComponent },
  { path: 'create-parche', redirectTo: 'create', pathMatch: 'full' },
  { path: 'join', component: JoinParcheComponent },
  { path: 'join-parche', redirectTo: 'join', pathMatch: 'full' },
  { path: 'parche-detail/:id', redirectTo: 'parche/:id', pathMatch: 'full' },
  { path: 'parche/:id', component: ParcheDetailComponent },
  { path: 'parche/:id/members', component: MembersComponent },
  { path: 'members/:id', redirectTo: 'parche/:id/members', pathMatch: 'full' },
  { path: 'parche/:parcheId/create-plan', component: CreatePlanComponent },
  { path: 'create-plan/:parcheId', redirectTo: 'parche/:parcheId/create-plan', pathMatch: 'full' },
  { path: 'parche/:parcheId/plan/:planId', component: PlanDetailComponent },
  { path: 'parche/:parcheId/ranking', component: RankingComponent },
  { path: '**', redirectTo: 'login' }
];
