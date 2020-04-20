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
  funds: FormArray;


  constructor(
    private paymentshandlerService: PaymentshandlerService,
    private eyhUserhandlerService: EyhUserhandlerService,
    private menuhandlerService: MenuhandlerService,
    private formBuilder: FormBuilder
  ) { 
    this.initContributionForm();
    this.socialusers =  JSON.parse(localStorage.getItem('socialusers'));
  }

  get contactFormGroup() {
    return this.contributionForm.get('payments') as FormArray;
  }

  initContributionForm() {
    this.contributionForm = new FormGroup({
      //payments: new FormArray([ this.intPayment() ])
      payments: new FormArray([])
    });
  }

  createPayment(user: EyhUser, totalAmount : number): FormGroup {
    let formGroup: FormGroup = new FormGroup(
      {
        "amount": new FormControl(totalAmount),
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
    users.map(u => {
      let fg: FormGroup;
      let totAmount = 0;
      console.log(u.emailId);
      this.paymentshandlerService.getUserPayedDetails({
        'emailId': u.emailId,
        'month':formatDate(new Date(), 'MMMM', 'en-US', '+0530')
      }).subscribe(d => {
         totAmount = d.map(p => parseInt(p['amount'])).reduce((a,b) => a + b, 0);
         console.log(totAmount);
         fg = this.createPayment(u, totAmount);
         formArray.push(fg);
         this.contributionForm.setControl('payment', formArray);

         this.curMonth = formatDate(new Date(), 'MMM', 'en-US', '+0530').toString();     
         //this.payments = this.contributionForm.value.payments;
         this.funds = this.contributionForm.get('payments') as FormArray;
      });
 
    });

  

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
          this.initContributionForm();
          this.eyhUserhandlerService.getUsers().subscribe(users =>{
            this.eyhUsers = this.eyhUserhandlerService.eyhUserMapper(users);
            this.initPaymentArray(this.eyhUsers);
            setTimeout(() => {
              this.menuhandlerService.activeDiv(event);
            },500);
            
            console.log(JSON.stringify(this.funds));
          });

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
