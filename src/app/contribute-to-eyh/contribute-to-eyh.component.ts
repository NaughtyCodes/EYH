import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PaymentshandlerService } from '../service/paymentshandler.service';
import { Payment } from '../models/payment';
import { Socialusers } from '../models/socialusers';
import { formatDate } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Identifiers } from '@angular/compiler';

@Component({
  selector: 'app-contribute-to-eyh',
  templateUrl: './contribute-to-eyh.component.html',
  styleUrls: ['./contribute-to-eyh.component.css']
})
export class ContributeToEYHComponent implements OnInit {

  socialusers = new Socialusers(); 
  manageHomeItems: MenuItem[];

  constructor(
    private paymentshandlerService: PaymentshandlerService
  ) { }

  ngOnInit() {

    this.manageHomeItems = [
      {
        label: 'Add 100', 
        command: (event) => {
          
          let userId: String;
          let payment: Payment;

          this.paymentshandlerService.getUsers().subscribe(users => 
            this.paymentshandlerService.eyhUserMapper(users).filter(u => {
              this.socialusers = JSON.parse(localStorage.getItem('socialusers'));

              if(u['emailId'] === this.socialusers.email){
                console.log(JSON.stringify(u));
                userId = u['id'];

                payment = {
                  "amount": "100",
                  "emailId": this.socialusers.email,
                  "timestamp": formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530'),
                  "userId": "/eyh-users/"+ userId,
                  "month": formatDate(new Date(), 'MMMM', 'en-US', '+0530'),
                  "year": formatDate(new Date(), 'yyyy', 'en-US', '+0530')
                };
                this.paymentshandlerService.addPayment(payment);
              }
          }));
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

}
