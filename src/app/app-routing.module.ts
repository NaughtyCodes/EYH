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
import { UpdateEventsComponent } from './update-events/update-events.component';
import { ReachUsComponent } from './reach-us/reach-us.component';
import { UpdateEventResolverService } from './resolvers/update-event-resolver.service';
import { ContributeToEYHComponent } from './contribute-to-eyh/contribute-to-eyh.component';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { ManageDonationComponent } from './manage-donation/manage-donation.component';
import { RunningBalanceComponent } from './running-balance/running-balance.component'
import { ManageStoryComponent } from './manage-story/manage-story.component';
import { HomesInfoComponent } from './homes-info/homes-info.component';
import { YourContributionComponent } from './your-contribution/your-contribution.component';
import { JoinToEYHComponent } from './join-to-eyh/join-to-eyh.component';

export const routes: Routes = [    
  {    
    path: '',    
    redirectTo: 'who-we-are',    
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
    }
  },
  {    
    path: 'who-we-are',    
    component: WhoweareComponent,    
    data: {    
      title: 'Who We Are'    
    }
  },
  {    
    path: 'what-we-do',    
    component: DashboardComponent,    
    data: {    
      title: 'What We Do'    
    }
  },
  {    
    path: 'story/:id',    
    component: StoryviewComponent,    
    data: {    
      title: 'View Story'    
    }
  },
  {    
    path: 'reach-us',    
    component: ReachUsComponent,    
    data: {    
      title: 'Reach Us'    
    }
  },
  {    
    path: 'upcoming-events',    
    component: UpcomingEventsComponent,    
    data: {    
      title: 'EYH - Upcoming Events'    
    },
    canActivate: [AuthGuardGuard] 
  },
  {    
    path: 'manage-story',    
    component: ManageStoryComponent,    
    data: {    
      title: 'EYH - Manage Story'    
    },
    canActivate: [AuthGuardGuard] 
  },
  {    
    path: 'home-info',    
    component: HomesInfoComponent,    
    data: {    
      title: 'EYH - Orphanage / Oldage Homes Info'    
    },
    canActivate: [AuthGuardGuard] 
  },
  {    
    path: 'manage-donation',    
    component: ManageDonationComponent,    
    data: {    
      title: 'EYH - Manage Donation'    
    },
    canActivate: [AuthGuardGuard] 
  },
  {    
    path: 'running-balance',    
    component: RunningBalanceComponent,    
    data: {    
      title: 'EYH - Running Balance'    
    },
    canActivate: [AuthGuardGuard] 
  },
  {    
    path: 'your-contribution',    
    component: YourContributionComponent,    
    data: {    
      title: 'EYH - Your Contribution'    
    },
    canActivate: [AuthGuardGuard] 
  },
  {    
    path: 'join-to-eyh',    
    component: JoinToEYHComponent ,  
    data: {    
      title: 'EYH - Join To Expand-Your-Hands'    
    },
    canActivate: [AuthGuardGuard] 
  },
  {    
    path: 'contribute-to-eyh',    
    component: ContributeToEYHComponent,    
    data: {    
      title: 'Contribute To EYH'    
    },
    canActivate: [AuthGuardGuard],
    resolve: { 
     preLoad: UpdateEventResolverService 
    }  
  },
  {    
    path: 'update-events',    
    component: UpcomingEventsComponent,    
    data: {    
      title: 'EYH - Upcoming Events'    
    },
    canActivate: [AuthGuardGuard]
  }
];    
@NgModule({    
  imports: [RouterModule.forRoot(routes)],    
  exports: [RouterModule]    
})    
export class AppRoutingModule { }