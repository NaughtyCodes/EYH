import { Component, OnInit } from '@angular/core';  
import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angular-6-social-login';  
import { SocialLoginModule, AuthServiceConfig } from 'angular-6-social-login';  
import { Socialusers } from '../models/socialusers';
import { SocialloginService } from '../service/sociallogin.service';  
import { Router, ActivatedRoute, Params } from '@angular/router';  
import { EyhUserhandlerService } from '../service/eyh-userhandler.service';

@Component({  
  selector: 'app-login',  
  templateUrl: './login.component.html',  
  styleUrls: ['./login.component.css']  
})  
export class LoginComponent implements OnInit {  
  

  response;  
    socialusers=new Socialusers();  
  constructor(  
    public OAuth: AuthService,  
    private SocialloginService: SocialloginService,  
    private eyhUserhandlerService: EyhUserhandlerService,
    private router: Router  
  ) { 

  }  
  ngOnInit() {  
  }  
  public socialSignIn(socialProvider: string) {  
    let socialPlatformProvider;  
    if (socialProvider === 'facebook') {  
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;  
    } else if (socialProvider === 'google') {  
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;  
    }  
    this.OAuth.signIn(socialPlatformProvider).then(socialusers => {  
      //console.log(socialProvider, socialusers);  
      //console.log(socialusers); 
      this.socialusers = socialusers;
      //this.router.navigate(['/dashboard']);   
      this.SavesLocalresponse(socialusers);  
    });  
  }
  
  SavesLocalresponse(socialusers: Socialusers) {
    this.eyhUserhandlerService.getRole(this.socialusers).subscribe(d=>{
      this.socialusers.role = d[0]['role'];
      this.eyhUserhandlerService.getGrants(d[0]['role']).subscribe(d => {
        this.socialusers.grants = d[0]['grant'];
        console.log(JSON.stringify(this.socialusers.grants));

        localStorage.setItem('socialusers', JSON.stringify( this.socialusers));  
        console.log(localStorage.getItem('socialusers'));
        this.SocialloginService.updateAuthStatus(true);  
        this.router.navigate(['/who-we-are']);   
      });
    });  
  }

  Savesresponse(socialusers: Socialusers) {  
    this.SocialloginService.Savesresponse(socialusers).subscribe((res: any) => {  
      debugger;  
      console.log(res);  
      this.socialusers=res;  
      this.response = res.userDetail; 
      this.eyhUserhandlerService.getRole(this.socialusers).subscribe(d=>{
        this.socialusers.role = d[0]['role'];

        this.eyhUserhandlerService.getGrants(d[0]['role']).subscribe(d => {
          this.socialusers.grants = d[0]['grants'];

          localStorage.setItem('socialusers', JSON.stringify( this.socialusers));
          console.log(localStorage.setItem('socialusers', JSON.stringify(this.socialusers)));  
          this.router.navigate(['/dashboard']);  
        });
      });
    });  
  }  
}