import { Component, OnInit } from '@angular/core';  
import { SocialLoginModule, AuthServiceConfig, AuthService } from 'angular-6-social-login';  
import { Socialusers } from '../models/socialusers'  
import { SocialloginService } from '../service/sociallogin.service';  
import { Router } from '@angular/router';  
@Component({  
  selector: 'app-dashboard',  
  templateUrl: './dashboard.component.html',  
  styleUrls: ['./dashboard.component.css']  
})  
export class DashboardComponent implements OnInit {  
  socialusers = new Socialusers();  
  constructor(
    public OAuth: AuthService,
    private SocialloginService: SocialloginService,      
    private router: Router
    ) { }  
  ngOnInit() {  
    this.socialusers = JSON.parse(localStorage.getItem('socialusers'));  
    console.log(this.socialusers.image);  
  }  
  logout() {
    this.SocialloginService.logoutUser();
    this.OAuth.signOut().then(data => {
      console.log('logout => '+data);  
      this.router.navigate(['/login']);
    });  
  }  
}