import { Component, OnInit } from '@angular/core';
import { PaymentshandlerService } from '../service/paymentshandler.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Socialusers } from '../models/socialusers';


@Component({
  selector: 'app-your-contribution',
  templateUrl: './your-contribution.component.html',
  styleUrls: ['./your-contribution.component.css']
})
export class YourContributionComponent implements OnInit {
  socialusers = new Socialusers();
  isPaymentTableLoaded: boolean = false;
  contribution = {};
  title:string;

  constructor(
    private paymentshandlerService: PaymentshandlerService,
    private route:ActivatedRoute, private router: Router
    ) {
      this.title = route.snapshot.data['title'];
      this.socialusers = JSON.parse(localStorage.getItem('socialusers'));
    
      
    // this.contribution = {
    //   'year':'2020',
    //   'sumTotal':'1000',
    //   'payments':[
    //     {
    //       'name':'Mohan',
    //       'total':'1000',
    //       'months':{
    //         'jan':'100',
    //         'feb':'100',
    //         'mar':'100',
    //         'apr':'100',
    //         'may':'100',
    //         'jun':'100',
    //         'jul':'100',
    //         'aug':'100',
    //         'sep':'100',
    //         'oct':'100',
    //         'nov':'100',
    //         'dec':'100'
    //       }
    //     }
    //   ]
    // }
  
  }

  ngOnInit() {
   this.loadPaymets();

  }

  loadPaymets():void {
    let payments = [];
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
      ];
        this.paymentshandlerService.getEyhUsers(this.socialusers.email,this.socialusers.role).subscribe(u =>{
          this.paymentshandlerService.eyhUserMapper(u).
          forEach(user => {
            let r = {};
            r['name']  = user['name'];
            this.paymentshandlerService.getPaymentsByUser(user['id'].toString(), formatDate(new Date(), 'yyyy', 'en-US', '+0530'))
            .subscribe(p => {
              //console.log(JSON.stringify(p));
              r['total'] = p.map(p => parseInt(p['amount'])).reduce((a,b) => a + b, 0);
              r['months'] = {};
              months.forEach(m => {
                r['months'][m.substr(0,3).toLowerCase()]  = p
                .filter(p=>p['month'] === m)
                .map(p => parseInt(p['amount'])).reduce((a,b) => a + b, 0);
              });
              console.log(JSON.stringify(r['months']));
              payments.push(r);
              this.contribution['year']     = formatDate(new Date(), 'yyyy', 'en-US', '+0530');
              this.contribution['sumTotal'] = payments.map(p => parseInt(p['total'])).reduce((a,b) => a + b, 0);
              this.contribution['payments'] = payments;
              console.log(JSON.stringify(this.contribution));
              this.isPaymentTableLoaded = payments.length === u.length;
            });
          });
        });
  }
  

}