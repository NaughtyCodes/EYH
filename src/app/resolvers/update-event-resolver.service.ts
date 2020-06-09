import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot  } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { EyhUserhandlerService } from '../service/eyh-userhandler.service';
import { PaymentshandlerService } from '../service/paymentshandler.service';
import { formatDate } from '@angular/common';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class UpdateEventResolverService implements Resolve<any> {

  user: any;
  paymentsList = [];
  userList=[];

  constructor(
    private eyhUserhandlerService: EyhUserhandlerService,
    private paymentshandlerService: PaymentshandlerService
  ) { 
    this.user = JSON.parse(localStorage.getItem('socialusers'));
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.preLoad().pipe(map(res =>{
      return res;
    }));

  }

  preLoad(): Observable<any[]> {

    let p =  this.paymentshandlerService.getUserPayedDetails({ 
      'month':formatDate(new Date(), 'MMMM', 'en-US', '+0530')
    });
    let u =  this.eyhUserhandlerService.getUsers();
    
    return forkJoin([p,u]);
  }  
}  



