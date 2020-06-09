import { Injectable } from '@angular/core';
import { Donations } from '../models/donations';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { switchMap, tap, shareReplay, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ManageDonationhandlerService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private firestore: AngularFirestore 
      ) { }
      donationsMapper(data: any): Donations[] {
        return data.map(e => {
          return {
            id: e.payload.doc.id,
            donatedDate: e.payload.doc.data()['donatedDate'],  
            donatedTo: e.payload.doc.data()['donatedTo'],  
            fundReleasedBy: e.payload.doc.data()['fundReleasedBy'],
            fundRequestedBy: e.payload.doc.data()['fundRequestedBy'],
            lastUpdated: e.payload.doc.data()['lastUpdated'],
            Month: e.payload.doc.data()['Month'],
            Others: e.payload.doc.data()['Others'],
            spendAmount: e.payload.doc.data()['spendAmount'],
            Year: e.payload.doc.data()['Year'],
          } as Donations;
        });
      }
      getDonations() {
        return this.firestore.collection('eyh-manage-donations',
        ref => ref
        .orderBy("lastUpdated")
        .limit(20)
        ).snapshotChanges().pipe(
          tap(arr => console.log(`read ${arr.length} docs.`)),
          take(1)
        ); 
      }
      getAllDonations() {
        return this.firestore.collection('eyh-manage-donations').snapshotChanges().pipe(
          tap(arr => console.log(`read ${arr.length} docs.`)),
          take(1)
        ); 
      }
    
      addDonation(donation:Donations){
        //console.log(JSON.parse(JSON.stringify(story)));
        return this.firestore.collection('eyh-manage-donations').add(donation);
      }
      
      updateDonation(id: string, donation:any) {
        return this.firestore.collection('eyh-manage-donations/').doc(id).update(donation);
      }

      deleteDonation(doantionId: string){
        return this.firestore.doc('eyh-manage-donations/' + doantionId).delete();
      }
    
}