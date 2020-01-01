import { Component, OnInit } from '@angular/core';
import { HomehandlerService } from '../service/homehandler.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Home } from '../models/home';
import { MenuItem } from 'primeng/api';
import { MenuhandlerService } from '../service/menuhandler.service';

@Component({
  selector: 'app-homes-info',
  templateUrl: './homes-info.component.html',
  styleUrls: ['./homes-info.component.css']
})
export class HomesInfoComponent implements OnInit {

  homes: Home[];
  isUpdate = false;
  isFormEditable = false;
  homeFormDisplay: boolean = false;
  homeForm: FormGroup;
  selectedHome = {};
  homeFromTitle = "";
  manageHomeItems: MenuItem[];

  constructor(
    private homehandlerService: HomehandlerService,
    private formBuilder: FormBuilder,
    private menuhandlerService: MenuhandlerService
  ) {
    this.createHomeUpdateForm();
   }

  ngOnInit() {
    this.listHomes();

    this.manageHomeItems = [
      {
        label: 'Add New Orphanage / Oldage Home Details', 
        command: (event) => {
          this.homeForm.reset();
          this.homeFromTitle = "Add New Orphanage / Oldage Home Details";
          this.homeFormDisplay = true;
          this.isUpdate = false;
        }
      },
      {
        label: 'Enable / Disable Edit', 
        command: (event) => {
          this.isFormEditable = this.isFormEditable === false ? true : false;
        }
      }
  ];

  }

  createHomeUpdateForm() {
    this.isUpdate = false;
    this.homeForm = this.formBuilder.group({
      name: [''],
      address: [''],
      contact: [''],
      note: ['']
    });
  }

  listHomes() {
    this.homehandlerService.getHomes().subscribe(data => {
      this.homes = this.homehandlerService.homeMapper(data);
    }, 
    errorCode => {
      console.log(errorCode);
    });
  }

  editHome($event :any,home : Home) {
    this.isUpdate = true;
    this.selectedHome = home;
    this.homeFromTitle = "Edit / Update Story";
    this.homeFormDisplay = true;
    this.homeForm.controls['name'].setValue(home.name);
    this.homeForm.controls['address'].setValue(home.address);
    this.homeForm.controls['contact'].setValue(home.contact);
    this.homeForm.controls['note'].setValue(home.note);
  }

  updateHome($event :any){
    let home: Home;
    home = {
      'name': this.homeForm.value['name'],
      'address': this.homeForm.value['address'],
      'contact': this.homeForm.value['contact'],  
      'note': this.homeForm.value['note'],
      'timestamp': formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530')     
    }

    if(this.isUpdate){
      this.homehandlerService.updateHome(this.selectedHome['id'],home).then( _ => {
        console.log("Record Updated..!");
        this.homeForm.reset();
        this.homeFormDisplay=false;
      },errorCode => {
        console.log(errorCode);
      });
    } else {
      this.homeForm.reset();
      this.homehandlerService.createHomeInfo(home).then( _ => {
        console.log("Record Inserted..!");
        this.homeForm.reset();
        this.homeFormDisplay = false;
      },errorCode => {
        console.log(errorCode);
      });
    } 
  }

  deleteHome($event: any, home: Home) {
    console.log('Deleting the story id => '+home.id);
    this.homehandlerService.deleteHome(home.id.toString()).then( _ => {
      alert('Deleted the story id => '+home.id);
    }, errorCode => {
      console.log(errorCode);
    });
 }

  clearForm(){
    this.homeForm.reset();
  }

}
