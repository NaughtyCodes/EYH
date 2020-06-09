import { Component, OnInit } from '@angular/core';
import { PaymentshandlerService } from '../service/paymentshandler.service';
import { ManageDonationhandlerService } from '../service/managedonationhandler.service';
@Component({
    selector: 'app-running-balance',
    // template: `<p>test</p>`,
    templateUrl: './running-balance.component.html',
    styleUrls: ['./running-balance.component.css']
  })
  export class RunningBalanceComponent implements OnInit {
    toatlcontributed:number=0;
    totaldonated:number=0;
    currentbalance:number=0;    
    constructor(
        private paymentshandlerService: PaymentshandlerService,
        private managedonationhandlerService: ManageDonationhandlerService,

    )
    {

    }
    ngOnInit() {
        //alert("test")
        this.totalContributedAmt();
        this.totalDonatedAmt();
    }
    totalContributedAmt()
    {
        let d
        this.paymentshandlerService.getPayments().subscribe(data => {
             d = this.paymentshandlerService.paymentMapper(data);
             console.log(d)
             this.toatlcontributed= d.map(p => parseInt(p['amount'])).reduce((a,b) => a + b, 0);
             console.log(this.toatlcontributed)
          })
    }
    totalDonatedAmt()
    {
        let d
        this.managedonationhandlerService.getDonations().subscribe(data => {
        d= this.managedonationhandlerService.donationsMapper(data);
        this.totaldonated= d.map(p => parseInt(p['spendAmount'])).reduce((a,b) => a + b, 0);
            console.log("data",this.totaldonated)
            this.currentBalanceAmt();
          }, 
          errorCode => {
            console.log(errorCode);
          });
    }
    currentBalanceAmt(){
        this.currentbalance=this.toatlcontributed-this.totaldonated
        console.log(this.currentbalance)
    }
    runningBalReload(){
        this.totalContributedAmt();
        this.totalDonatedAmt();
    }
  }