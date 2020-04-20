import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TreeNode } from 'primeng/api/treenode';
import { AngularFirestore } from '@angular/fire/firestore';
import { Payment } from '../models/payment';
import { EyhUser } from '../models/eyh-user';
import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaymentshandlerService {
 
  getUserPayedDetails$: BehaviorSubject<string|null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private firestore: AngularFirestore 
  ) { 
    this.getUserPayedDetails$ = new BehaviorSubject(null);
    this.queryUserPayedDetails();
  }

  paymentMapper(data: any): Payment[] {
    return data.map(e => {
      const userId = e.payload.doc.data().userId.split("/")[2];
      return {
        id: e.payload.doc.id,
        amount: e.payload.doc.data()['amount'],
        emailId: e.payload.doc.data()['emailId'],  
        month: e.payload.doc.data()['month'],
        timestamp: e.payload.doc.data()['timestamp'],
        userId: userId,
        year: e.payload.doc.data()['year'],
        updatedBy: e.payload.doc.data()['updatedBy']
      } as Payment;
    });
  }

  eyhUserMapper(data: any): EyhUser[] {
    return data.map(e => {
      return {
        id: e.payload.doc.id,
        emailId: e.payload.doc.data()['emailId'],  
        name: e.payload.doc.data()['name'],  
      } as EyhUser;
    });
  }

  getPayments() {
    return this.firestore.collection('eyh-payments').snapshotChanges();
  }

  getUsers() {
    return this.firestore.collection('eyh-users').snapshotChanges();
  }

  getUser(emailId: any) {
    let eyhUser: EyhUser;
    this.getUsers().subscribe(data => {
      //console.log(JSON.stringify(this.eyhUserMapper(data)));
      data.filter(e => e['emailId'] === emailId).map(e => {
        return eyhUser = {
          "id": e['id'],
          "name": e['name'],
          "emailId":e['emailId'],
        } as EyhUser;
      });
    });
    //return {"name":"mohan"};
  }

  getUserPayedDetails(param: any){
    if(param !== null){
      return this.firestore.collection('eyh-payments', 
        ref => ref
          .where('emailId', '==', param['emailId'])
          .where('month', '==', param['month']))
          .valueChanges()
      } 
      return this.firestore.collection('eyh-payments', ref => ref.where('emailId', '==', '').where('month', '==', '')).valueChanges();
   //this.getUserPayedDetails$.next(param); 
  }

  queryUserPayedDetails(): any{
    const queryObservable = this.getUserPayedDetails$.pipe(
      switchMap((param: any) => {
       if(param !== null){
        return this.firestore.collection('eyh-payments', 
          ref => ref
            .where('emailId', '==', param['emailId'])
            .where('month', '==', param['month']))
            .valueChanges()
        } 
        return this.firestore.collection('eyh-payments', ref => ref.where('emailId', '==', '').where('month', '==', '')).valueChanges()
      })
  );

    queryObservable.subscribe(data => {
      //console.log(JSON.stringify(data));
    });

    return queryObservable;
  }

  addPayment(payment: Payment) {
    return this.firestore.collection('eyh-payments').add(payment);
  }

  updatePayment(payment: Payment) {
    return "";
  }


}
