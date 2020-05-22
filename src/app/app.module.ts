import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angular-6-social-login';  
import { SocialLoginModule, AuthServiceConfig } from 'angular-6-social-login';  
import { HttpClientModule } from '@angular/common/http';

import { AuthGuardGuard } from './guards/AuthGuard/auth-guard.guard';
import { LoginGuard } from './guards/Login/login.guard';
import { NotfoundComponent } from './notfound/notfound.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { WhoweareComponent } from './whoweare/whoweare.component';
import { WhatwedoComponent } from './whatwedo/whatwedo.component';
import { StoryviewComponent } from './layout/storyview/storyview.component';

import { TreeModule} from 'primeng/tree';
import { MenuModule} from 'primeng/menu';
import { TabMenuModule} from 'primeng/tabmenu';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { UpdateEventsComponent } from './update-events/update-events.component';

import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { SessionService } from './service/session.service';

import { ReachUsComponent } from './reach-us/reach-us.component';
import { HomesInfoComponent } from './homes-info/homes-info.component';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { ContributeToEYHComponent } from './contribute-to-eyh/contribute-to-eyh.component';
import { JoinToEYHComponent } from './join-to-eyh/join-to-eyh.component';
import { YourContributionComponent } from './your-contribution/your-contribution.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AgGridModule } from 'ag-grid-angular';

export function socialConfigs() {  
  const config = new AuthServiceConfig(  
    [  
      {  
        id: FacebookLoginProvider.PROVIDER_ID,  
        provider: new FacebookLoginProvider('app -id')  
      },  
      {  
        id: GoogleLoginProvider.PROVIDER_ID,  
        provider: new GoogleLoginProvider('1035425538389-98klarp2qk28dhvdmplcotj0j6bik2so.apps.googleusercontent.com')  
      }  
    ]  
  );  
  return config;  
}  

@NgModule({  
  declarations: [  
    AppComponent,  
    LoginComponent,  
    DashboardComponent, 
    NotfoundComponent, 
    HeaderComponent, 
    FooterComponent, 
    WhoweareComponent, 
    WhatwedoComponent, 
    StoryviewComponent, 
    UpdateEventsComponent, ReachUsComponent, HomesInfoComponent, UpcomingEventsComponent, ContributeToEYHComponent, JoinToEYHComponent, YourContributionComponent  
  ],  
  imports: [  
    BrowserModule,  
    BrowserAnimationsModule,
    HttpClientModule,  
    AppRoutingModule,
    NgbModule ,
    TreeModule,
    MenuModule,
    TabMenuModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AgGridModule.withComponents([]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],  
  providers: [  
    SessionService,
    AuthService,
    AuthGuardGuard,
    LoginGuard,
    {  
      provide: AuthServiceConfig,  
      useFactory: socialConfigs  
    }, 
    {
      provide: LocationStrategy, 
      useClass: PathLocationStrategy
    }  
  ],  
  bootstrap: [AppComponent]  
})  
export class AppModule {


}
