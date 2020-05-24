import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TreeNode } from 'primeng/api/treenode';
import { AngularFirestore } from '@angular/fire/firestore';
import { Home } from '../models/home';
import { tap } from 'rxjs/internal/operators/tap';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';

@Injectable({
  providedIn: 'root'
})
export class HomehandlerService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private firestore: AngularFirestore 
    ) { }

    homeMapper(data: any): Home[] {
      return data.map(e => {
        return {
          id: e.payload.doc.id,
          name: e.payload.doc.data()['name'],  
          address: e.payload.doc.data()['address'],  
          contact: e.payload.doc.data()['contact'],  
          note: e.payload.doc.data()['note'],  
          timestamp: e.payload.doc.data()['timestamp']   
        } as Home;
      });
    }

    getHomes() {
      return this.firestore.collection('eyh-homes-info').snapshotChanges().pipe(
        tap(arr => console.log(`read ${arr.length} docs.`)),
        shareReplay(1)
      );
    }
  
    createHomeInfo(home: Home){
      return this.firestore.collection('eyh-homes-info').add(home);
    }
  
    updateHome(homeId: string, home: Home){
      return this.firestore.collection('eyh-homes-info').doc(homeId).update(home);
    }
  
    deleteHome(homeId: string){
      return this.firestore.doc('eyh-homes-info/' + homeId).delete();
    }

}
