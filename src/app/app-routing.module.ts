import { NgModule } from '@angular/core';    
import { Routes, RouterModule } from '@angular/router';    
import { DashboardComponent } from './dashboard/dashboard.component';    
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component'; 
import { AuthGuardGuard } from './guards/AuthGuard/auth-guard.guard';
import { LoginGuard } from './guards/Login/login.guard';

export const routes: Routes = [    
  {    
    path: '',    
    redirectTo: 'login',    
    pathMatch: 'full' 
  },
  // {    
  //   path: '/',    
  //   redirectTo: 'login',    
  //   pathMatch: 'full' 
  // },
  {
     path: '**', 
     redirectTo: 'NotfoundComponent'
  },
  { 
    path: '404', 
    component: NotfoundComponent 
  },
  {    
    path: 'login',    
    component: LoginComponent,    
    data: {    
      title: 'Login Page'
    },
    canActivate: [LoginGuard]
  },    
  {    
    path: 'Dashboard',    
    component: DashboardComponent,    
    data: {    
      title: 'Dashboard Page'    
    },
    canActivate: [AuthGuardGuard]    
  },       
];    
@NgModule({    
  imports: [RouterModule.forRoot(routes)],    
  exports: [RouterModule]    
})    
export class AppRoutingModule { }