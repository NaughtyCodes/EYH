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
  listPayments: any;
  amount: any;
  note: any;
  paymentFormDisplay: boolean = false;
  paymentForm: FormGroup;
  selectedPayment: Payment;
  paymentFromTitle:string = 'Payment Form';


  constructor(
    private paymentshandlerService: PaymentshandlerService,
    private eyhUserhandlerService: EyhUserhandlerService,
    private menuhandlerService: MenuhandlerService,
    private formBuilder: FormBuilder
  ) { 
    this.createEditPaymentForm();
    this.initContributionForm();
    this.socialusers =  JSON.parse(localStorage.getItem('socialusers'));
  }

  get contactFormGroup() {
    return this.contributionForm.get('payments') as FormArray;
  }

  initContributionForm() {
    this.contributionForm = new FormGroup({
      //payments: new FormArray([ this.intPayment() ])
      payments: new FormArray([ ])
    });
  }

  createPayment(user: EyhUser, totalAmount : number): FormGroup {
    let formGroup: FormGroup = new FormGroup(
      {
        "Totalamount": new FormControl(totalAmount),
        "amount": new FormControl(0),
        "emailId": new FormControl(user['emailId']),
        "month": new FormControl(formatDate(new Date(), 'MMMM', 'en-US', '+0530')),
        "timestamp": new FormControl(formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530')),
        "userId": new FormControl("/eyh-users/"+ user.id),
        "year": new FormControl(formatDate(new Date(), 'yyyy', 'en-US', '+0530')),
        "updatedBy": new FormControl(this.socialusers.email),
        "note": new FormControl(''),
        "name": new FormControl(user['name']),
      }
    );
    return formGroup;
  }

  initPaymentArray(users: EyhUser[]) {
    
    const formArray = this.contributionForm.controls.payments as FormArray;
    users.map(u => {
      let fg: FormGroup;
      let totAmount = 0;
      let note = '';
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
          this.menuhandlerService.activeDiv(event);
          this.eyhUserhandlerService.getUsers().subscribe(users =>{
            this.eyhUsers = this.eyhUserhandlerService.eyhUserMapper(users);
            this.initPaymentArray(this.eyhUsers);
            // setTimeout(() => {
            //   this.menuhandlerService.activeDiv(event);
            // },600);
            
            console.log(JSON.stringify(this.funds));
          });

        }
      },
      {
        label: 'List-Users', 
        command: (event) => {
          this.paymentshandlerService.getUsers().subscribe(data => {
            console.log(JSON.stringify(this.paymentshandlerService.eyhUserMapper(data)));
            this.eyhUsers = this.paymentshandlerService.eyhUserMapper(data);
            this.menuhandlerService.activeDiv(event);
          }, 
          errorCode => {
            console.log(errorCode);
          });
        }
      },
      {
        label: 'List-Payments', 
        command: (event) => {
          this.paymentshandlerService.getPayments().subscribe(data => {
            console.log(JSON.stringify(this.paymentshandlerService.paymentMapper(data)));
            this.menuhandlerService.activeDiv(event);
            this.listPayments = this.paymentshandlerService.paymentMapper(data);
          }, 
          errorCode => {
            console.log(errorCode);
          });
        }
      }
  ];

  }
  
  createEditPaymentForm() {
    this.paymentForm = this.formBuilder.group({
      amount: [''],
      emailId: [''],
      month: [''],
      name: [''],
      note: [''],
      timestamp: [''],
      userId: [''],
      year: [''],
      updatedBy: ['']
    });
  }

  editPaymentForm($event :any,payment : Payment) {
    this.paymentFormDisplay = true;
    this.selectedPayment = payment;
    this.paymentForm.controls['name'].setValue(payment.name);
    this.paymentForm.controls['month'].setValue(payment.month);
    this.paymentForm.controls['amount'].setValue(payment.amount);
    this.paymentForm.controls['note'].setValue(payment.note);
  }

  updatePayment($event: any){
    let up: any;
    up = {
      'name': this.paymentForm.value['name'],
      'month': this.paymentForm.value['month'],
      'amount': this.paymentForm.value['amount'],
      'note': this.paymentForm.value['note']
    };
    this.paymentshandlerService.updatePayment(this.selectedPayment['id'].toString(),up).then( _ => {
      console.log("Record Updated..!");
      this.paymentForm.reset();
      this.paymentFormDisplay=false;
    },errorCode => {
      console.log(errorCode);
    });
  }

  boo(): void{
    console.log("Just an another on click..!!");
  }

  onSubmit(): void {
    let p = this.contributionForm.value.payments;
    console.log("form val--------->",p.length)
    this.contributionForm.reset();
    p.forEach((r,index) => {
      this.paymentshandlerService.addPayment(r).then( _ => {
        console.log("Record Updated..!",index);
        if(p.length==index+1)
        {
          this.initContributionForm();
          this.eyhUserhandlerService.getUsers().subscribe(users =>{
          this.eyhUsers = this.eyhUserhandlerService.eyhUserMapper(users);
          this.initPaymentArray(this.eyhUsers);
          });
        }
        // this.eyhUserhandlerService.getUsers().subscribe(users =>{
        //   this.eyhUsers = this.eyhUserhandlerService.eyhUserMapper(users);
        //   this.initPaymentArray(this.eyhUsers);
        // });
      },errorCode => {
        console.log(errorCode);
      });
    });
  }

  clearForm(){
    this.paymentForm.reset();
  }
  
  deletePayments($event: any, payment: Payment) {
    console.log('Deleting the payment id => '+payment.id);
    this.paymentshandlerService.deletePayments(payment.id.toString()).then( _ => {
      alert('Deleted the payment id => '+payment.id);
    }, errorCode => {
      console.log(errorCode);
    });
 }

}