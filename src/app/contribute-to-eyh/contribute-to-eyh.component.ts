import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Payment } from '../models/payment';
import { Socialusers } from '../models/socialusers';
import { formatDate } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Identifiers } from '@angular/compiler';
import { EyhUserhandlerService } from '../service/eyh-userhandler.service';
import { PaymentshandlerService } from '../service/paymentshandler.service';
import { MenuhandlerService } from '../service/menuhandler.service';
import { EyhUser } from '../models/eyh-user';
import { GridOptions } from "ag-grid-community";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contribute-to-eyh',
  templateUrl: './contribute-to-eyh.component.html',
  styleUrls: ['./contribute-to-eyh.component.css']
})
export class ContributeToEYHComponent implements OnInit {
  
  socialusers = new Socialusers(); 
  manageHomeItems: MenuItem[];
  eyhUsers: any;
  listPayments: any;

  curMonth = '';
  contributionForm: FormGroup;
  funds: FormArray;
  amount: any;
  note: any;
  
  paymentFormDisplay: boolean = false;
  paymentForm: FormGroup;
  selectedPayment: Payment;
  paymentFromTitle:string = 'Payment Form';
  
  addContributionRowdata = [];

  title: string;
  private gridApi: any;
  private gridColumnApi: any;
  private gridOptions: GridOptions;

  private contributionGridApi: any;
  private contributionGridColumnApi: any;
  private contributionGridOptions: GridOptions;
  
  userListcolumnDefs = [
    {field: 'name' },
    {field: 'emailId' },
    {field: 'timestamp'}
  ];

  addContributionColumnDefs = [
    {field: 'name', checkboxSelection: true},
    {field: 'month'},
    {field: 'amount'},
    {field: 'updatedBy'},
    {field: 'note'}
  ]

  constructor(
    private route:ActivatedRoute, 
    private router: Router,
    private paymentshandlerService: PaymentshandlerService,
    private eyhUserhandlerService: EyhUserhandlerService,
    private formBuilder: FormBuilder,
    private menuhandlerService: MenuhandlerService
  ) { 
    this.createEditPaymentForm();
    this.initContributionForm();
    this.socialusers = JSON.parse(localStorage.getItem('socialusers'));
    this.title = route.snapshot.data['title'];
    this.eyhUsers = this.eyhUserhandlerService.eyhUserMapper(this.route.snapshot.data['preLoad'][1]);
    this.listPayments = this.paymentshandlerService.paymentMapper(this.route.snapshot.data['preLoad'][0]);
  }

  ngOnInit() {

    this.manageHomeItems = [
      {
        label: 'Add-Contribution', 
        command: (event) => {
          this.initContributionForm();
          this.initPaymentArray(this.eyhUsers);
          this.menuhandlerService.activeDiv(event);
          setTimeout(() => {
            this.autoSizeAll(this.contributionGridColumnApi);
          },500);
        }
      },
      {
        label: 'List-Users', 
        command: (event) => {
          this.menuhandlerService.activeDiv(event);
          setTimeout(() => {
            this.autoSizeAll(this.gridColumnApi);
          },500)
        }
      },
      {
        label: 'List-Payments', 
        command: (event) => {
          this.menuhandlerService.activeDiv(event);
        }
      }
  ];
    
  }
  
  autoSizeAll(gridColumnApi: any) {
    var allColumnIds = [];
    gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  // Contribution Form

  createPayment(user: EyhUser, totalAmount : number): FormGroup {
    let formGroup: FormGroup = new FormGroup(
      {
        "amount": new FormControl(totalAmount),
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

  initContributionForm() {
    this.contributionForm = new FormGroup({
      payments: new FormArray([ ])
    });
  }

  initPaymentArray(users: EyhUser[]) {
    const formArray = this.contributionForm.controls.payments as FormArray;
    users.map(u => {
      let fg: FormGroup;
      let totAmount = 0;
      let note = '';  
        let d = this.listPayments.filter(p => p['emailId'] === u.emailId && p['month'] === formatDate(new Date(), 'MMMM', 'en-US', '+0530'));
        totAmount = d.map(p => parseInt(p['amount'])).reduce((a,b) => a + b, 0);
        fg = this.createPayment(u, totAmount);
        formArray.push(fg);
        this.contributionForm.setControl('payment', formArray);
        this.curMonth = formatDate(new Date(), 'MMM', 'en-US', '+0530').toString();     
        this.funds = this.contributionForm.get('payments') as FormArray;
        console.log(JSON.stringify(this.funds.value));
        this.addContributionRowdata = this.funds.value;
    });
  }

  onContributionGridReady(params) {
    this.contributionGridApi = params.api;
    this.contributionGridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    params.api.resetRowHeights();
  }

  // Contribution From
  
  // List Payment code block
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
// List Payment code block

}