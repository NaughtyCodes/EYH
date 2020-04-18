import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { PaymentshandlerService } from '../service/paymentshandler.service';
import { Payment } from '../models/payment';
import { Socialusers } from '../models/socialusers';
import { formatDate } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Identifiers } from '@angular/compiler';
import { EyhUserhandlerService } from '../service/eyh-userhandler.service';
import { MenuhandlerService } from '../service/menuhandler.service';
import { EyhUser } from '../models/eyh-user';

@Component({
  selector: 'app-contribute-to-eyh',
  templateUrl: './contribute-to-eyh.component.html',
  styleUrls: ['./contribute-to-eyh.component.css']
})
export class ContributeToEYHComponent implements OnInit {

  socialusers = new Socialusers(); 
  manageHomeItems: MenuItem[];
  eyhUsers: any;
  curMonth = '';
  contributionForm: FormGroup;
  payments: [];

  constructor(
    private paymentshandlerService: PaymentshandlerService,
    private eyhUserhandlerService: EyhUserhandlerService,
    private menuhandlerService: MenuhandlerService,
    private formBuilder: FormBuilder
  ) { 
    this.socialusers =  JSON.parse(localStorage.getItem('socialusers'));
  }

  get contactFormGroup() {
    return this.contributionForm.get('payments') as FormArray;
  }

  initContributionForm() {
    this.contributionForm = this.formBuilder.group({
      payments: this.formBuilder.array([])
      //payments: this.formBuilder.array([this.intPayment()])
    });
  }

  createPayment(user: EyhUser): FormGroup {
    let formGroup: FormGroup = new FormGroup(
      {
        "amount": new FormControl("100"),
        "emailId": new FormControl(user['name']),
        "timestamp": new FormControl(formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530')),
        "userId": new FormControl("/eyh-users/"+ user.id),
        "month": new FormControl(formatDate(new Date(), 'MMMM', 'en-US', '+0530')),
        "year": new FormControl(formatDate(new Date(), 'yyyy', 'en-US', '+0530')),
        "updatedBy": new FormControl(this.socialusers.email)
      }
    );
    return formGroup;
  }

  initPaymentArray(users: EyhUser[]) {
    const formArray = this.contributionForm.controls.payments as FormArray;
    users.map(item => {
      let d: FormGroup;
      console.log(item.emailId);
      d = this.createPayment(item)
      formArray.push(d);
    });
    this.contributionForm.setControl('payment', formArray);
  }

  intPayment(): FormGroup {
    return this.formBuilder.group({
      amount: [''],
      emailId: [''],
      month: [''],
      timestamp: [''],
      userId: [''],
      year: [''],
      updatedBy: ['']
    });
  }

  ngOnInit() {

    this.manageHomeItems = [
      {
        label: 'Add-Contribution', 
        command: (event) => {   
          this.paymentshandlerService.getUserPayedDetails('hellomohanakrishnan@gmail.com');
        /*         
            this.initContributionForm();
            this.eyhUserhandlerService.getUsers().subscribe(users =>{
            //this.eyhUsers = this.eyhUserhandlerService.eyhUserMapper(users);
            this.eyhUsers = this.eyhUserhandlerService.eyhUserMapper(users);
            this.initPaymentArray(this.eyhUsers);
            this.curMonth = formatDate(new Date(), 'MMM', 'en-US', '+0530').toString();     
            console.log(JSON.stringify(this.eyhUsers));
            this.menuhandlerService.activeDiv(event);
            this.payments = this.contributionForm.value.payments;
            console.log(JSON.stringify(this.payments));
        
          });
        */  
          // let userId: String;
          // let payment: Payment;

          // this.paymentshandlerService.getUsers().subscribe(users => 
          //   this.paymentshandlerService.eyhUserMapper(users).filter(u => {
          //     this.socialusers = JSON.parse(localStorage.getItem('socialusers'));

          //     if(u['emailId'] === this.socialusers.email){
          //       console.log(JSON.stringify(u));
          //       userId = u['id'];

          //       payment = {
          //         "amount": "100",
          //         "emailId": this.socialusers.email,
          //         "timestamp": formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530'),
          //         "userId": "/eyh-users/"+ userId,
          //         "month": formatDate(new Date(), 'MMMM', 'en-US', '+0530'),
          //         "year": formatDate(new Date(), 'yyyy', 'en-US', '+0530'),
          //         "updatedBy": this.socialusers.email
          //       };
          //       this.paymentshandlerService.addPayment(payment);
          //     }
          // }));
        }
      },
      {
        label: 'List Users', 
        command: (event) => {
          this.paymentshandlerService.getUsers().subscribe(data => {
            console.log(JSON.stringify(this.paymentshandlerService.eyhUserMapper(data)));
          }, 
          errorCode => {
            console.log(errorCode);
          });
        }
      },
      {
        label: 'List Payments', 
        command: (event) => {
          this.paymentshandlerService.getPayments().subscribe(data => {
            console.log(JSON.stringify(this.paymentshandlerService.paymentMapper(data)));
          }, 
          errorCode => {
            console.log(errorCode);
          });
        }
      }
  ];

  }

  

  boo(): void{
    console.log("Just an another on click..!!");
  }

}
