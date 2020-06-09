import { Component, OnInit,ViewChild  } from '@angular/core'; //Added by Rajesh T
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
import { AgGridAngular } from 'ag-grid-angular';//Added by Rajesh T
import {ConfirmationService} from 'primeng/api'//Added by Rajesh T
import {MessageService} from 'primeng/api';//Added by Rajesh T
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contribute-to-eyh',
  templateUrl: './contribute-to-eyh.component.html',
  styleUrls: ['./contribute-to-eyh.component.css'],
  providers: [ConfirmationService,MessageService] //Added by Rajesh T
})
export class ContributeToEYHComponent implements OnInit {
  @ViewChild('agGrid', {static:false}) agGrid: AgGridAngular;//Added by Rajesh T
  socialusers = new Socialusers(); 
  manageHomeItems: MenuItem[];
  eyhUsers: any;
  listPayments: any;
  curMonth = '';
  contributionForm: FormGroup;
  funds: FormArray;
  amount: any;
  note: any;
  selectedValue:any;
  paymentFormDisplay: boolean = false;
  paymentForm: FormGroup;
  selectedPayment: Payment;
  paymentFromTitle:string = 'Payment Form';
  display: boolean = false;//Added by Rajesh T
  content:String; //Added by Rajesh T
  
  addContributionRowdata = [];

  title: string;
  private gridApi: any;
  
  //Added by Rajesh T
  userListcolumnDefs = [
    {field: 'name',sortable: true,filter:true},
    {field: 'emailId',width:300,sortable: true,filter:true},
    {field: 'timestamp',sortable: true,filter:true}
  ];
  addContributionColumnDefs = [
    {field: 'name',checkboxSelection: true, headerCheckboxSelection: true,sortable: true,filter:true },
    {field: 'month',width:100},
    {field:'Totalamount',width:150,sortable: true,filter:true},
    {field: 'amount',width:120,editable:true,filter:true,singleClickEdit:true},
    {field: 'updatedBy',sortable: true,filter:true},
    {field: 'note',width:200,editable:true,singleClickEdit:true,cellEditor: 'agLargeTextCellEditor',
    cellEditorParams: {
        maxLength: '500',   // override the editor defaults
        cols: '80',
        rows: '8'
    }}
  ]
  
//-----------End---------------------------------------------

  constructor(
    private route:ActivatedRoute, 
    private router: Router,
    private paymentshandlerService: PaymentshandlerService,
    private eyhUserhandlerService: EyhUserhandlerService,
    private formBuilder: FormBuilder,
    private menuhandlerService: MenuhandlerService,
    private messageService: MessageService,//Added by Rajesh T
    private confirmationService: ConfirmationService //Added by Rajesh T
  ) { 
    this.createEditPaymentForm();
    this.initContributionForm();
    this.socialusers = JSON.parse(localStorage.getItem('socialusers'));
    this.title = route.snapshot.data['title'];
    this.eyhUsers = this.eyhUserhandlerService.eyhUserMapper(this.route.snapshot.data['preLoad'][1]);
    this.listPayments = this.paymentshandlerService.paymentMapper(this.route.snapshot.data['preLoad'][0]);
  }
   //Added by Rajesh T
   showDialog() {
    this.display = true;
  }
  //--------End----------
  ngOnInit() {
    //this.selectedValue="null"
    this.manageHomeItems = [
      {
        label: 'Add-Contribution', 
        command: (event) => {
          this.initContributionForm();
          this.initPaymentArray(this.eyhUsers);
          this.menuhandlerService.activeDiv(event);
        }
      },
      {
        label: 'List-Users', 
        command: (event) => {
          this.menuhandlerService.activeDiv(event);
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

  errorMsg(msg:any) {
      this.messageService.add({severity:'error', summary:'Error Message', detail:msg});
    }
    successMsg(msg:any) {
      this.messageService.add({severity:'success', summary:'Success Message', detail:msg});
    }
  // Contribution Form

  createPayment(user: EyhUser, totalAmount : number,note:string): FormGroup {
    let formGroup: FormGroup = new FormGroup(
      {
        "Totalamount": new FormControl(totalAmount),//Added by Rajesh T
        "amount":new FormControl(0),// Modified by Rajesh T
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
        console.log(d)
        totAmount = d.map(p => parseInt(p['amount'])).reduce((a,b) => a + b, 0);
        console.log("total",totAmount)
        fg = this.createPayment(u, totAmount,note);
        formArray.push(fg);
        this.contributionForm.setControl('payment', formArray);
        this.curMonth = formatDate(new Date(), 'MMM', 'en-US', '+0530').toString();     
        this.funds = this.contributionForm.get('payments') as FormArray;
        console.log("data",JSON.stringify(this.funds.value));
        this.addContributionRowdata = this.funds.value;
    });
  }

  // onContributionGridReady(params) {
  //   this.contributionGridApi = params.api;
  //   this.contributionGridColumnApi = params.columnApi;
  //   params.api.sizeColumnsToFit();
  //   params.api.resetRowHeights();
  // }

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

  //Added by Rajesh T
  onGridReady(params) {
    this.gridApi = params.api;
   //this.gridColumnApi = params.columnApi;
    }
  getSelectedRows() {
      const selectedRow = this.gridApi.getSelectedRows();
      let msg1="Please select atleast one row for update"
      let msg2=selectedRow.length+"row are selectd for update"
      let msg3="Plese enter the amount to update"
      console.log(selectedRow)
      if(selectedRow.length==0)
      {
        this.showDialog()
        this.content="Please select any one row for update"
      }
      else if(selectedRow.length>=1)
      {
        let d = selectedRow.filter(p => p['amount'] === 0);
        if(d.length>=1){
          this.errorMsg(msg3)
        }
        else{
          this.addconfirm(msg2,selectedRow)
        }
        
      }
     
    }
    addconfirm(msg:any,rowdata:any){
        let msg1="Data successfully updated"
        let msg2="Data not upadated"
        this.confirmationService.confirm({
          message:msg,
          accept: () => {
            this.contributionForm.reset();
            this.initContributionForm();
            rowdata.forEach((r,index) => {
              console.log("test",r)
              this.paymentshandlerService.addPayment(r).then( _ => {
                console.log("Record Updated..!");
                if(rowdata.length==index+1)
                {
                  this.successMsg(msg1)
                  this.paymentshandlerService.getUserPayedDetails({ 
                    'month':formatDate(new Date(), 'MMMM', 'en-US', '+0530')
                  }).subscribe(data => {
                    this.listPayments = this.paymentshandlerService.paymentMapper(data);
                    this.initPaymentArray(this.eyhUsers);
                  })
                }
              
              },errorCode => {
                this.errorMsg(msg2)
                console.log(errorCode);
              });
            });
          }
      });
    }
    //--------------------End-----------------------------------
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
      console.log(this.selectedValue)
      if(this.selectedValue)
      {
        this.changeUser(event)
      }
      else
      {
        this.getReloadData()
      }
    },errorCode => {
      console.log(errorCode);
    });
  }

  clearForm(){
    this.paymentForm.reset();
  }

  deletePayments($event: any, payment: Payment) {
    console.log('Deleting the payment id => '+payment.id);
    this.confirmationService.confirm({
      message:'Deleting the payment id => '+payment.id,
      accept: () => {
        this.paymentshandlerService.deletePayments(payment.id.toString()).then( _ => {
          this.successMsg('Deleted the payment id => '+payment.id);
          console.log(this.selectedValue)
          if(this.selectedValue)
          {
            this.changeUser(event)
          }
          else
          {
            this.getReloadData()
          }
        }, errorCode => {
          console.log(errorCode);
        });
      }
    })
   
 }
// List Payment code block
changeUser(event:any){
  console.log(this.selectedValue)
  //getUserPayedAllDetails
  if(this.selectedValue)
  {
    this.paymentshandlerService.getUserPayedAllDetails({ 
      'emailId':this.selectedValue,
      'year':formatDate(new Date(), 'yyyy', 'en-US', '+0530')
    }).subscribe(data => {
      this.listPayments = this.paymentshandlerService.paymentMapper(data);
      console.log(this.listPayments)
    })
 }
}
getReloadData(){
  this.selectedValue=""
  this.paymentshandlerService.getUserPayedDetails({ 
    'month':formatDate(new Date(), 'MMMM', 'en-US', '+0530')
  }).subscribe(data => {
    this.listPayments = this.paymentshandlerService.paymentMapper(data);
  })
}
deleteAllPayments(){
  let d;
  this.paymentshandlerService.getPayments().subscribe(data => {
    d = this.paymentshandlerService.paymentMapper(data);
    console.log(d)
    d.map((p,index) => {
      parseInt(p['amount'])
      this.paymentshandlerService.deletePayments(p['id']).then( _ => {
        console.log("deleted"+p['id'])
        if(d.length==index+1)
        {
          this.successMsg("all payements deleted")
          this.getReloadData()
        }
    
      })
    })
 })
}
}