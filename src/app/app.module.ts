import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

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
    DashboardComponent, NotfoundComponent, HeaderComponent, FooterComponent  
  ],  
  imports: [  
    BrowserModule,  
    HttpClientModule,  
    AppRoutingModule,
    NgbModule 
  ],  
  providers: [  
    AuthService,  
    {  
      provide: AuthServiceConfig,  
      useFactory: socialConfigs  
    }, LoginGuard,
    AuthGuardGuard
  ],  
  bootstrap: [AppComponent]  
})  
export class AppModule { }
