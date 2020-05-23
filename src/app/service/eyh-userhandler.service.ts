import { Injectable } from '@angular/core';
import { EyhUser } from '../models/eyh-user';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { SocialUser } from 'angular-6-social-login';

@Injectable({
  providedIn: 'root'
})
export class EyhUserhandlerService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private firestore: AngularFirestore 
  ) { }

  eyhUserMapper(data: any): EyhUser[] {
    return data.map(e => {
      return {
        id: e.payload.doc.id,
        emailId: e.payload.doc.data()['emailId'],  
        name: e.payload.doc.data()['name'],  
        timestamp: e.payload.doc.data()['timestamp']
      } as EyhUser;
    });
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

  createUser(eyhUser: EyhUser){
    //console.log(JSON.parse(JSON.stringify(story)));
    return this.firestore.collection('eyh-users').add(eyhUser);
  }

  updateUser(id: string, eyhUser: EyhUser){
    return this.firestore.collection('eyh-users').doc(id).update(eyhUser);
  }

  deleteUser(id: string){
    return this.firestore.doc('eyh-users/' + id).delete();
  }



  getGrants(role: string){
    return this.firestore.collection('eyh-roles', 
      ref => ref
        .where('role', '==', role))
        .valueChanges();
  }

  getRole(user: SocialUser){   
    return this.firestore.collection('eyh-users', 
      ref => ref
        .where('emailId', '==', user['email'] ))
        .valueChanges();       
  }

  getRoles(){
    return this.firestore.collection('eyh-roles', ref => ref).valueChanges();      
  }

  checkRoute(): Observable<any[]> {
    let user = JSON.parse(localStorage.getItem('socialusers'));
    let role = this.getRole(user);
    let roles = this.firestore.collection('eyh-roles', ref => ref).valueChanges();
    return forkJoin([role, roles]);
  }

}
