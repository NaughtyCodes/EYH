import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import {MenuItem} from 'primeng/api';
import { StoryhandlerService } from '../service/storyhandler.service';
import { Story } from '../models/story';


@Component({
  selector: 'app-update-events',
  templateUrl: './update-events.component.html',
  styleUrls: ['./update-events.component.css']
})
export class UpdateEventsComponent {

  storys: Story;
  activeItem: MenuItem;
  storyForm: FormGroup;
  display: boolean = false;
  items: MenuItem[];
  manageStoryItems: MenuItem[];

  constructor(
    private storyhandlerService: StoryhandlerService, 
    private formBuilder: FormBuilder
  ) { 
    this.createStoryUpdateForm();
  }

  ngOnInit() {

      this.listStorys();
      
      this.items = [
        {
          label: 'Manage-Story', 
          icon:  'pi pi-pencil',
          command: (event) => {
            this.listStorys();

          }
        },
        {label: 'Manage-Info', icon: 'pi pi-info-circle'},
        {label: 'Manage-Contact', icon: 'pi pi-globe'}
      ];

      this.manageStoryItems = [
        {
          label: 'Story List', 
          icon: 'fa fa-fw fa-bar-chart', 
          
          command: (event) => {
            this.listStorys();
          }
        },
        {
          label: 'Add New Story', 
          icon: 'fa fa-fw fa-calendar',
          command: (event) => {
      
          }
        }
    ];

  }

  createStoryUpdateForm() {
    this.storyForm = this.formBuilder.group({
      storyTitle: [''],
      story: ['']
    });
  }

  manageStory() {
    this.listStorys();
  }

  listStorys() {
    this.storyhandlerService.getStorys().subscribe(data => {
      console.log(JSON.stringify(data));
      this.storys =  data['data'];
    }, 
    errorCode => {
      console.log(errorCode);
    });
  }

  editStory($event,story) {
    //alert(story);
    this.display = true;
  }

  updateStory($event){
    alert($event.toElement.form.elements.story.value);
  }

  deleteStory() {

  }

}
