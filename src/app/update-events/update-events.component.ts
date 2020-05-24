import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MenuItem } from 'primeng/api';
import { StoryhandlerService } from '../service/storyhandler.service';
import { FirebaseService } from '../service/firebase.service';
import { Story } from '../models/story';
import { formatDate } from '@angular/common';
import { MenuhandlerService } from '../service/menuhandler.service';


@Component({
  selector: 'app-update-events',
  templateUrl: './update-events.component.html',
  styleUrls: ['./update-events.component.css']
})
export class UpdateEventsComponent {

  stories: Story[];
  activeItem: MenuItem;
  storyForm: FormGroup;
  storyFormDisplay: boolean = false;
  items: MenuItem[];
  manageStoryItems: MenuItem[];
  base64ImageData = "";
  storyFromTitle = "";
  isUpdate = false;
  selectedStory = {};
  menuHeading = "EYH - Upcoming Events";

  constructor(
    private menuhandlerService: MenuhandlerService,
  ) { 
    
  }

  ngOnInit() {
      this.menuhandlerService.clearClass(".tab-menu-view","active-tab");
      this.menuhandlerService.addClass("[for=Upcoming-Events]","active-tab");
      
      this.items = [
        {
          label: 'Upcoming-Events', 
          icon: 'pi pi-globe',
          command: ($event) => {
            this.menuHeading = "EYH - Upcoming Events";
            this.menuhandlerService.active($event);
          }
        },
        {
          label: 'Manage-Story', 
          icon:  'pi pi-pencil',
          command: ($event) => {
            this.menuHeading = "EYH - Manage Story";
            this.menuhandlerService.active($event);
          }
        },
        {
          label: 'Home-Info', 
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.menuHeading = "EYH - Orphanage / Oldage Homes Info";
            this.menuhandlerService.active($event);
          }
        },
        {
          label: 'Manage-Donation', 
          icon: 'pi pi-globe',
          command: ($event) => {
            this.menuHeading = "EYH - Manage Donation";
            this.menuhandlerService.active($event);
          }
        },
        {
          label: 'Your-Contribution', 
          icon: 'pi pi-globe',
          command: ($event) => {
            this.menuHeading = "EYH - Your Contribution";
            this.menuhandlerService.active($event);
          }
        },
        {
          label: 'Contribute-To-EYH', 
          icon: 'pi pi-globe',
          command: ($event) => {
            this.menuHeading = "EYH - Contribute To Expand-Your-Hands";
            this.menuhandlerService.active($event);
          }
        },
        {
          label: 'Join-To-EYH', 
          icon: 'pi pi-globe',
          command: ($event) => {
            this.menuHeading = "EYH - Join To Expand-Your-Hands";
            this.menuhandlerService.active($event);
          }
        }
      ];

  }



}
