import { Component, OnInit } from '@angular/core';  
import { SocialLoginModule, AuthServiceConfig, AuthService } from 'angular-6-social-login';  
import { Router } from '@angular/router';  
import { Story } from '../models/story';
import { StoryhandlerService } from '../service/storyhandler.service';
@Component({  
  selector: 'app-dashboard',  
  templateUrl: './dashboard.component.html',  
  styleUrls: ['./dashboard.component.css']  
})  
export class DashboardComponent implements OnInit {  

  storys: Story;

  constructor(
    public OAuth: AuthService,
    private storyhandlerService: StoryhandlerService,      
    private router: Router
    ) { }  
  ngOnInit() {  
    this.storyhandlerService.getStorys().subscribe(data => {
      console.log(JSON.stringify(data));
      this.storys =  data['data'];
    }, 
    errorCode => {
      console.log(errorCode);
    });
  }  

}