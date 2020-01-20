import { Component, OnInit } from '@angular/core';
import { HomehandlerService } from '../service/homehandler.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Home } from '../models/home';
import { MenuItem } from 'primeng/api';
import { MenuhandlerService } from '../service/menuhandler.service';
import { PaymentshandlerService } from '../service/paymentshandler.service';
import { EyhUser } from '../models/eyh-user';
import { EyhUserhandlerService } from '../service/eyh-userhandler.service';

@Component({
  selector: 'app-join-to-eyh',
  templateUrl: './join-to-eyh.component.html',
  styleUrls: ['./join-to-eyh.component.css']
})
export class JoinToEYHComponent implements OnInit {

  eyhUsers: EyhUser[];
  isUpdate = false;
  isFormEditable = false;
  userFormDisplay: boolean = false;
  userForm: FormGroup;
  selectedUser = {};
  userFromTitle = "";
  formButtonName = "";
  manageUserItems: MenuItem[];

  constructor(
    private eyhUserhandlerService: EyhUserhandlerService,
    private formBuilder: FormBuilder,
    private menuhandlerService: MenuhandlerService,
    private paymentshandlerService: PaymentshandlerService
  ) {
    this.createEyhUserUpdateForm();
   }

  ngOnInit() {
    this.listUsers();

    this.manageUserItems = [
      {
        label: 'Add New EYH Member', 
        command: (event) => {
          this.userForm.reset();
          this.userFromTitle = "Add New EYH Member";
          this.formButtonName = "Add New User";
          this.userFormDisplay = true;
          this.isUpdate = false;
        }
      },
      {
        label: 'Enable / Disable Edit', 
        command: (event) => {
          this.formButtonName = "Update User";
          this.isFormEditable = this.isFormEditable === false ? true : false;
        }
      }
  ];

  }

  createEyhUserUpdateForm() {
    this.isUpdate = false;
    this.userForm = this.formBuilder.group({
      name: [''],
      email: [''],
      lastUpdate:['']
    });
  }

  listUsers() {
    this.paymentshandlerService.getUsers().subscribe(data => {
      this.eyhUsers = this.eyhUserhandlerService.eyhUserMapper(data);
    }, 
    errorCode => {
      console.log(errorCode);
    });
  }

  editUser($event :any,eyhUser : EyhUser) {
    this.isUpdate = true;
    this.selectedUser = eyhUser;
    this.userFromTitle = "Edit / Update Story";
    this.userFormDisplay = true;
    this.userForm.controls['name'].setValue(eyhUser.name);
    this.userForm.controls['email'].setValue(eyhUser.emailId);
  }

  updateUser($event :any){
    let eyhUser: EyhUser;
    eyhUser = {
      'name': this.userForm.value['name'],
      'emailId': this.userForm.value['email'],
      'timestamp': formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530')     
    }

    if(this.isUpdate){
      this.eyhUserhandlerService.updateUser(this.selectedUser['id'],eyhUser).then( _ => {
        console.log("Record Updated..!");
        this.userForm.reset();
        this.userFormDisplay=false;
      },errorCode => {
        console.log(errorCode);
      });
    } else {
      this.userForm.reset();
      this.eyhUserhandlerService.createUser(eyhUser).then( _ => {
        console.log("Record Inserted..!");
        this.userForm.reset();
        this.userFormDisplay = false;
      },errorCode => {
        console.log(errorCode);
      });
    } 
  }

  deleteUser($event: any, eyhUser: EyhUser) {
    console.log('Deleting the story id => '+eyhUser.id);
    this.eyhUserhandlerService.deleteUser(eyhUser.id.toString()).then( _ => {
      alert('Deleted the story id => '+eyhUser.id);
    }, errorCode => {
      console.log(errorCode);
    });
 }

  clearForm(){
    this.userForm.reset();
  }

}
