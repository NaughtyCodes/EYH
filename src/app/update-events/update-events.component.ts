import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MenuItem } from 'primeng/api';
import { StoryhandlerService } from '../service/storyhandler.service';
import { FirebaseService } from '../service/firebase.service';
import { Story } from '../models/story';
import { formatDate } from '@angular/common';


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
            this.storyFromTitle = "Add A New Story";
            this.storyFormDisplay = true;
          }
        }
    ];

  }

  createStoryUpdateForm() {
    this.isUpdate = false;
    this.storyForm = this.formBuilder.group({
      storyTitle: [''],
      story: [''],
      image: ['']
    });
  }

  manageStory() {
    this.listStorys();
  }

  listStorys() {
    this.storyhandlerService.getStories().subscribe(data => {
      this.stories = this.storyhandlerService.storyMapper(data);
    }, 
    errorCode => {
      console.log(errorCode);
    });
  }

  editStory($event,story) {
    this.isUpdate = true;
    this.selectedStory = story;
    this.storyFromTitle = "Edit / Update Story";
    this.storyFormDisplay = true;
    this.storyForm.controls['storyTitle'].setValue(story.storyTitle);
    this.storyForm.controls['story'].setValue(story.story);
    this.base64ImageData = story.imageData !== "" ? story.imageData : "";
  }

  updateStory($event){
    let story: Story;
    story = {
      'hasImage': this.base64ImageData !== "" ? 'Y' : 'N',  
      'imageData': this.base64ImageData,
      'storyTitle': this.storyForm.value['storyTitle'],  
      'story': this.storyForm.value['story'],
      'timestamp': formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530')     
    }

    if(this.isUpdate){
      this.storyhandlerService.updateStory(this.selectedStory['id'],story).then( _ => {
        alert("Record Updated..!");
        this.storyForm.reset();
        this.base64ImageData="";
        this.storyFormDisplay=false;
      },errorCode => {
        console.log(errorCode);
      });
    } else {
      this.storyhandlerService.createStory(story).then( _ => {
        alert("Record Inserted..!");
        this.storyForm.reset();
        this.base64ImageData="";
        this.storyFormDisplay=false;
      },errorCode => {
        console.log(errorCode);
      });
    } 
  }

  clearForm(){
    this.storyForm.reset();
  }

  onFileChange($event) {

    const reader = new FileReader();
 
    if($event.target.files && $event.target.files.length) {
      const [file] = $event.target.files;
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.storyForm.patchValue({
          file: reader.result
       });

       this.base64ImageData = reader.result.toString();

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  deleteStory($event,story) {
    console.log('Deleting the story id => '+story.id);
    this.storyhandlerService.deleteStory(story.id).then( _ => {
      alert('Deleted the story id => '+story.id);
      this.storyForm.reset();
      this.base64ImageData="";
      this.storyFormDisplay=false;
    }, errorCode => {
      console.log(errorCode);
    });
 }

}
