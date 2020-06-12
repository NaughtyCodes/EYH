import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Socialusers } from '../models/socialusers';
import { EyhUserhandlerService } from '../service/eyh-userhandler.service';
import { ManageDonationhandlerService } from '../service/managedonationhandler.service';
import { MenuhandlerService } from '../service/menuhandler.service';
import { EyhUser } from '../models/eyh-user';
import {Donations} from '../models/donations';
import {ConfirmationService} from 'primeng/api'//Added by Rajesh T
import {MessageService} from 'primeng/api';
import {RunningBalanceComponent} from '../running-balance/running-balance.component';
import { ButtonRendererComponent } from '../button-render/button-render.component';
@Component({
  selector: 'app-manage-donation',
  templateUrl: './manage-donation.component.html',
  styleUrls: ['./manage-donation.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class ManageDonationComponent implements OnInit {
  socialusers = new Socialusers(); 
  title:string;
  donationFormDisplay:boolean = false;
  donationForm: FormGroup;
  donationEditForm:FormGroup;
  isUpdate:boolean=false;
  isDelete:boolean=false;
  submitted = false;
  isReadonly:boolean=false;
  isReadonlyOthers:boolean=true;
  isOthersEditable:boolean=false;
  isEditable:boolean=true;

  eyhUsers: any;
  manageDonationItems: MenuItem[];
  addDonationRowdata:any;
  private gridApi;//Added by Rajesh T
  private gridColumnApi;//Added by Rajesh T
  frameworkComponents: any;

  constructor( 
    private managedonationhandlerService: ManageDonationhandlerService,
    private eyhUserhandlerService: EyhUserhandlerService,
    private formBuilder: FormBuilder,
    private menuhandlerService: MenuhandlerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route:ActivatedRoute, private router: Router
    ) {
      this.socialusers = JSON.parse(localStorage.getItem('socialusers'));
      this.title = route.snapshot.data['title'];
      this.createDonationForm(); 
      this.EditDonationForm();
      this.frameworkComponents = {
        buttonRenderer: ButtonRendererComponent,
      }
    }
    addDonationColumnDefs = [
      {field:'',width:41,
      cellRenderer: 'buttonRenderer',
      // cellRenderer: (data) => {
      //   return `<button class="btn" style="padding:1px 6px !important" click="onClick(data)"><i class="pi pi-info-circle" style="font-size:1.50em"></i></button`;
    cellRendererParams: {
      onClick: this.onBtnClick1.bind(this),
      label: 'click'
    }},
      {field: 'donatedDate', checkboxSelection: true, headerCheckboxSelection: true,editable:true,sortable: true,filter:true },
      {field: 'donatedTo',width:300,editable:true,sortable: true,filter:true,singleClickEdit:true,cellEditor: 'agLargeTextCellEditor',
      cellEditorParams: {
          maxLength: '500',   // override the editor defaults
          cols: '80',
          rows: '8'
      }},
      {field: 'spendAmount',editable:true,sortable: true,filter:true},
      {field: 'fundReleasedBy',sortable: true,filter:true},
      {field: 'fundRequestedBy',editable:true,sortable: true,filter:true},
      {field: 'Month',width:100,sortable: true,filter:true},
      {field: 'Year',width:80,sortable: true,filter:true},
      {field: 'lastUpdated',sortable: true,filter:true},
      {field: 'Others',editable:true,sortable: true,filter:true}
    ]
   
    // addDonationRowdata=[
    //   {
    //     "Month": "May",
    //     "Others": "testing",
    //     "Year": "2020",
    //     "donatedDate": "2020-05-22",
    //     "donatedTo": "senthil",
    //     "fundReleasedBy": "Rajesh",
    //     "fundRequestedBy": "mohanakrishnan",
    //     "spendAmount":"1000",
    //     "lastUpdated": "29-05-2020 11:09:26 PM"
    //   }
    // ]
    errorMsg(msg:any) {
      this.messageService.add({severity:'error', summary:'Error Message', detail:msg});
    }
    successMsg(msg:any) {
      this.messageService.add({severity:'success', summary:'Success Message', detail:msg});
    }
  ngOnInit() {
    this.listUsers()
    this.manageDonationItems = [
      {
        label: 'Add-Donations', 
        command: (event) => {
          this.createDonationForm()
          this.menuhandlerService.activeDiv(event);
        }
      },
      {
        label: 'List-Donations', 
        command: (event) => {
          this.listDonations()
          this.menuhandlerService.activeDiv(event);
        }
      },
      {
        label: 'Running-Balance', 
        command: ($event) => {
          //this.listDonations()
          //this.demo.currentBalanceAmt()
          //this.router.navigate(['/running-balance']);
          this.menuhandlerService.activeDiv($event);
        }
      }
  ];
    //this.createDonationForm();
  }
  createDonationForm() {
    this.donationForm = this.formBuilder.group({
      donatedDate: ['',Validators.required],
      donatedTo: ['',Validators.required],
      fundReleasedBy:[this.socialusers.name],
      fundRequestedBy: ['',Validators.required],
      lastUpdated:formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530'),
      Month:formatDate(new Date(), 'MMMM', 'en-US', '+0530'),
      Others : ['Requested By User',Validators.required],
      spendAmount :['',Validators.required],
      Year:formatDate(new Date(), 'yyyy', 'en-US', '+0530')
    });
  }
  get fval() {
    return this.donationForm.controls;
    }
  
  changeUser($event :any){
    let selectedVal=this.donationForm.value['fundRequestedBy']
    console.log(selectedVal)
    if(selectedVal=="Others")
      {
        this.isReadonly=false;
        this.isOthersEditable=true;
        this.donationForm.controls['Others'].setValue('');
      }
      else
      {
        this.isReadonly=true;
        this.isOthersEditable=false;
        this.donationForm.controls['Others'].setValue('Requested By User');
      }
    }
  EditDonationForm() {
    this.donationEditForm = this.formBuilder.group({
      donatedid:[''],
      donatedDate: ['',Validators.required],
      donatedTo: ['',Validators.required],
      fundReleasedBy:[this.socialusers.name],
      fundRequestedBy: ['',Validators.required],
      lastUpdated:[''],
      Month:[''],
      Others : ['',Validators.required],
      spendAmount :['',Validators.required],
      Year:['']
    });
  }
  get fEval() {
    return this.donationEditForm.controls;
  }
  changeUserEdit($event :any){
    let selectedVal=this.donationEditForm.value['fundRequestedBy']
    console.log(selectedVal)
    if(selectedVal=="Others")
      {
        this.isReadonlyOthers=false;
        this.isOthersEditable=true;
        this.donationEditForm.controls['Others'].setValue('');
      }
      else
      {
        this.isReadonlyOthers=true;
        this.isOthersEditable=false;
        this.donationEditForm.controls['Others'].setValue('Requested By User');
      }
    }
  listUsers() {
    this.eyhUserhandlerService.getUsers().subscribe(data => {
      this.eyhUsers = this.eyhUserhandlerService.eyhUserMapper(data);
      console.log("users",this.eyhUsers)
    }, 
    errorCode => {
      console.log(errorCode);
    });
  }
  saveDonation($event :any){
    this.submitted = true;
  if (this.donationForm.invalid) {
  return;
  }
    let managedonations: Donations;
    let msg1="Data successfully saved"
    let msg2="Data not saved"
    managedonations={
      'donatedDate':this.donationForm.value['donatedDate'],
      'donatedTo':this.donationForm.value['donatedTo'],
      'fundReleasedBy':this.donationForm.value['fundReleasedBy'],
      'fundRequestedBy':this.donationForm.value['fundRequestedBy'],
      'lastUpdated':formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530'),
      'Month':this.donationForm.value['Month'],
      'Others':this.donationForm.value['Others'],
      'spendAmount': this.donationForm.value['spendAmount'],
      'Year': this.donationForm.value['Year']
      }
      console.log(managedonations)
      
      this.managedonationhandlerService.addDonation(managedonations).then( _ => {
        console.log("Record Inserted..!");
        this.submitted = false;
        this.donationForm.reset();
        this.createDonationForm();
        this.successMsg(msg1)
      },errorCode => {
        this.errorMsg(msg2)
        console.log(errorCode);
      }); 
    }
    listDonations() {
      this.managedonationhandlerService.getDonations().subscribe(data => {
        this.addDonationRowdata = this.managedonationhandlerService.donationsMapper(data);
        console.log("data",this.addDonationRowdata)
      }, 
      errorCode => {
        console.log(errorCode);
      });
    }
    getAllDoantions(){
      this.managedonationhandlerService.getAllDonations().subscribe(data => {
        this.addDonationRowdata = this.managedonationhandlerService.donationsMapper(data);
        console.log("data",this.addDonationRowdata)
      }, 
      errorCode => {
        console.log(errorCode);
      });
    }
    //Added by Rajesh T
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
      }
      SelectedRowsforUpdate() {
        const selectedRow = this.gridApi.getSelectedRows();
        let msg1="please select any one row for update "
        let msg2= selectedRow.length+" rows selected for update"
        if(selectedRow.length<1)
        {
          this.errorMsg(msg1)
        }
        else if(selectedRow.length>=1)
        {
          this.upconfirm(msg2,selectedRow)
        }
      }
      upconfirm(msg:any,selectedRow:any) {
        let msg3= selectedRow.length+" rows are updated"
        let msg4=selectedRow.length+" rows are not updated"
        this.confirmationService.confirm({
            message: msg,
            accept: () => {
              selectedRow.forEach((r,index) => {
                let rowid=r["id"]
                let updatedata:any;
                updatedata={
                  'donatedDate':r['donatedDate'],
                  'donatedTo':r['donatedTo'],
                  'fundReleasedBy':r['fundReleasedBy'],
                  'fundRequestedBy':r['fundRequestedBy'],
                  'lastUpdated':formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530'),
                  'Month':r['Month'],
                  'Others':r['Others'],
                  'spendAmount':r['spendAmount'],
                  'Year':r['Year']
                  }
                  console.log(updatedata)
                  this.managedonationhandlerService.updateDonation(rowid.toString(),updatedata).then( _ => {
                  console.log("Record Updated..!");
                  if(selectedRow.length==index+1)
                  {
                    this.successMsg(msg3)
                    this.listDonations()
                  }
                
                },errorCode => {
                  this.errorMsg(msg4)
                  console.log(errorCode);
                });
              });
            }
        });
      }
      SelectedRowforEdit(){
        const selectedRow = this.gridApi.getSelectedRows();
        let msg1="Please select any one row for edit"
        let msg2="Only one row allowd for edit at atime"
        if(selectedRow.length<1)
        {
          this.errorMsg(msg1);
        }
        else if(selectedRow.length>1)
        {
          this.errorMsg(msg2);
        }
        else if(selectedRow.length==1)
        {
        this.donationFormDisplay=true
        this.isReadonly=false;
        this.isEditable=true;
        this.donationEditForm.controls['fundRequestedBy'].enable()
        selectedRow.forEach((r,index) => {
        let rowid=r["id"]
        console.log(rowid)
        console.log(index)
        this.donationEditForm.controls['donatedid'].setValue(rowid);
        this.donationEditForm.controls['donatedDate'].setValue(r['donatedDate']);
        this.donationEditForm.controls['donatedTo'].setValue(r['donatedTo']);
        this.donationEditForm.controls['fundReleasedBy'].setValue(r['fundReleasedBy']);
        this.donationEditForm.controls['fundRequestedBy'].setValue(r['fundRequestedBy']);
        this.donationEditForm.controls['lastUpdated'].setValue(r['lastUpdated']);
        this.donationEditForm.controls['Month'].setValue(r['Month']);
        this.donationEditForm.controls['Others'].setValue(r['Others']);
        this.donationEditForm.controls['spendAmount'].setValue(r['spendAmount']);
        this.donationEditForm.controls['Year'].setValue(r['Year']);
        })
      }
       
      }
      updateDonation($event :any){
        this.submitted = true;
        if (this.donationEditForm.invalid) {
        return;
        }
        let msg1="Data successfully updated"
        let msg2="Data not updated"
        let updatedoantion:any;
        let donationid=this.donationEditForm.value['donatedid'];
        updatedoantion={
          'donatedDate':this.donationEditForm.value['donatedDate'],
          'donatedTo':this.donationEditForm.value['donatedTo'],
          'fundReleasedBy':this.donationEditForm.value['fundReleasedBy'],
          'fundRequestedBy':this.donationEditForm.value['fundRequestedBy'],
          'lastUpdated':formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530'),
          'Month':this.donationEditForm.value['Month'],
          'Others':this.donationEditForm.value['Others'],
          'spendAmount': this.donationEditForm.value['spendAmount'],
          'Year': this.donationEditForm.value['Year']
          }
          console.log(updatedoantion)
          this.managedonationhandlerService.updateDonation(donationid.toString(),updatedoantion).then( _ => {
            console.log("Record Updated..!")
              this.successMsg(msg1)
              this.listDonations()
              this.submitted = false;
              this.donationEditForm.reset()
              this.donationFormDisplay=false;

          },errorCode => {
            this.errorMsg(msg2)
            console.log(errorCode);
          });
      }
      SelectedRowsforDelete() {
        const selectedRow = this.gridApi.getSelectedRows();
        let msg1="please select any one row for delete "
        let msg2= selectedRow.length+" rows selected for delete"
        if(selectedRow.length<1)
        {
          this.errorMsg(msg1)
        }
        else if(selectedRow.length>=1)
        {
          
          this.delconfirm(msg2,selectedRow)
          console.log(this.isDelete)
        }
      }
      delconfirm(msg:any,selectedRow:any) {
        let msg3= selectedRow.length+" rows are deleted"
        let msg4=selectedRow.length+" rows are not deleted"
        this.confirmationService.confirm({
            message: msg,
            accept: () => {
              selectedRow.forEach((r,index) => {
                let rowid=r["id"]
                  this.managedonationhandlerService.deleteDonation(rowid.toString()).then( _ => {
                  console.log("Record Deleted..!");
                  if(selectedRow.length==index+1)
                  {
                    this.successMsg(msg3)
                    this.listDonations()
                  }
                
                },errorCode => {
                  this.errorMsg(msg4)
                  console.log(errorCode);
                });
              });
            }
        });
      }
      onBtnClick1(e) {
        this.donationFormDisplay=true
        console.log(e)
        this.isReadonly=true;
        this.isEditable=false;
        this.donationEditForm.controls['fundRequestedBy'].disable();
        this.donationEditForm.controls['donatedid'].setValue(e.rowData['id']);
          this.donationEditForm.controls['donatedDate'].setValue(e.rowData['donatedDate']);
          this.donationEditForm.controls['donatedTo'].setValue(e.rowData['donatedTo']);
          this.donationEditForm.controls['fundReleasedBy'].setValue(e.rowData['fundReleasedBy']);
          this.donationEditForm.controls['fundRequestedBy'].setValue(e.rowData['fundRequestedBy']);
          this.donationEditForm.controls['lastUpdated'].setValue(e.rowData['lastUpdated']);
          this.donationEditForm.controls['Month'].setValue(e.rowData['Month']);
          this.donationEditForm.controls['Others'].setValue(e.rowData['Others']);
          this.donationEditForm.controls['spendAmount'].setValue(e.rowData['spendAmount']);
          this.donationEditForm.controls['Year'].setValue(e.rowData['Year']);
        //this.rowDataClicked1 = e.rowData;
      }
}
