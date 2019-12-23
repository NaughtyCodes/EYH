import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MenuItem } from 'primeng/api';
import { StoryhandlerService } from '../service/storyhandler.service';
import { FirebaseService } from '../service/firebase.service';
import { Story } from '../models/story';


@Component({
  selector: 'app-update-events',
  templateUrl: './update-events.component.html',
  styleUrls: ['./update-events.component.css']
})
export class UpdateEventsComponent {

  stories: Story[];
  activeItem: MenuItem;
  storyForm: FormGroup;
  display: boolean = false;
  items: MenuItem[];
  manageStoryItems: MenuItem[];

  constructor(
    private storyhandlerService: StoryhandlerService,
    private firebaseService: FirebaseService, 
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef
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
      story: [''],
      image: [null, Validators.required]
    });
  }

  manageStory() {
    this.listStorys();
  }

  listStorys() {
    this.storyhandlerService.getStories().subscribe(data => {
      this.stories = this.storyhandlerService.storyMapper(data);
      console.log(JSON.stringify(this.stories));
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
    console.log(JSON.stringify(this.storyForm.value));
  }

  clearForm(){
    this.storyForm.reset();
  }

/*
  onFileChange($event) {

    const reader = new FileReader();
 
    if($event.target.files && $event.target.files.length) {
      const [file] = $event.target.files;
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.storyForm.patchValue({
          file: reader.result
       });
       
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }
*/

  deleteStory() {

  }

}
