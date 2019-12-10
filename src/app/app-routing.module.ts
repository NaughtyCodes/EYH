import { NgModule } from '@angular/core';    
import { Routes, RouterModule } from '@angular/router';    
import { DashboardComponent } from './dashboard/dashboard.component';    
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component'; 
import { AuthGuardGuard } from './guards/AuthGuard/auth-guard.guard';
import { LoginGuard } from './guards/Login/login.guard';
import { WhoweareComponent } from './whoweare/whoweare.component';
import { WhatwedoComponent } from './whatwedo/whatwedo.component';
import { StoryviewComponent } from './layout/storyview/storyview.component';

export const routes: Routes = [    
  {    
    path: '',    
    redirectTo: 'login',    
    pathMatch: 'full' 
  },
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
    path: 'dashboard',    
    component: DashboardComponent,    
    data: {    
      title: 'Dashboard Page'    
    },
    canActivate: [AuthGuardGuard]    
  },
  {    
    path: 'who-we-are',    
    component: WhoweareComponent,    
    data: {    
      title: 'Who We Are'    
    },
    canActivate: [AuthGuardGuard]    
  },
  {    
    path: 'what-we-do',    
    component: DashboardComponent,    
    data: {    
      title: 'What We Do'    
    },
    canActivate: [AuthGuardGuard]    
  },
  {    
    path: 'story/:id',    
    component: StoryviewComponent,    
    data: {    
      title: 'View Story'    
    }
    // canActivate: [AuthGuardGuard]    
  }
];    
@NgModule({    
  imports: [RouterModule.forRoot(routes)],    
  exports: [RouterModule]    
})    
export class AppRoutingModule { }