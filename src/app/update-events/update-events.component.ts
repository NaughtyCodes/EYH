import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MenuItem } from 'primeng/api';
import { StoryhandlerService } from '../service/storyhandler.service';
import { FirebaseService } from '../service/firebase.service';
import { Story } from '../models/story';
import { formatDate } from '@angular/common';
import { MenuhandlerService } from '../service/menuhandler.service';
import { Router, ActivatedRoute, Params } from '@angular/router'; 


@Component({
  selector: 'app-update-events',
  template: 
            `<div class="col-sm-3">
            <h3>Manage Menu</h3>
            <p-menu [model]="items"></p-menu>
            </div>`,
  styleUrls: ['./update-events.component.css']
})
export class UpdateEventsComponent {
  
  activeItem: MenuItem;
  items: MenuItem[];
  manageStoryItems: MenuItem[];
  menuHeading = "EYH - Upcoming Events";

  constructor(
    private menuhandlerService: MenuhandlerService,
    private router: Router
  ) { 
    
  }

  ngOnInit() {
      //this.menuhandlerService.clearClass(".tab-menu-view","active-tab");
      //this.menuhandlerService.addClass("[for=Upcoming-Events]","active-tab");
      
      this.items = [
        {
          label: 'Upcoming-Events', 
          icon: 'pi pi-globe',
          command: ($event) => {
            //this.menuHeading = "EYH - Upcoming Events";
            //this.menuhandlerService.active($event);
            this.router.navigate(['/upcoming-events']);   
          }
        },
        {
          label: 'Manage-Story', 
          icon:  'pi pi-pencil',
          command: ($event) => {
            //this.menuHeading = "EYH - Manage Story";
            //this.menuhandlerService.active($event);
            this.router.navigate(['/manage-story']);   
          }
        },
        {
          label: 'Home-Info', 
          icon: 'pi pi-info-circle',
          command: ($event) => {
            //this.menuHeading = "EYH - Orphanage / Oldage Homes Info";
            //this.menuhandlerService.active($event);
            this.router.navigate(['/home-info']);   
          }
        },
        {
          label: 'Manage-Donation', 
          icon: 'pi pi-globe',
          command: ($event) => {
            //this.menuHeading = "EYH - Manage Donation";
            //this.menuhandlerService.active($event);
            this.router.navigate(['/manage-donation']);   
          }
        },
        {
          label: 'Your-Contribution', 
          icon: 'pi pi-globe',
          command: ($event) => {
            //this.menuHeading = "EYH - Your Contribution";
            //this.menuhandlerService.active($event);
            this.router.navigate(['/your-contribution']);   
          }
        },
        {
          label: 'Contribute-To-EYH', 
          icon: 'pi pi-globe',
          command: ($event) => {
            //this.menuHeading = "EYH - Contribute To Expand-Your-Hands";
            //this.menuhandlerService.active($event);
            this.router.navigate(['/contribute-to-eyh']);   
          }
        },
        {
          label: 'Join-To-EYH', 
          icon: 'pi pi-globe',
          command: ($event) => {
            //this.menuHeading = "EYH - Join To Expand-Your-Hands";
            //this.menuhandlerService.active($event);
            this.router.navigate(['/join-to-eyh']);   
          }
        }
      ];

  }



}
