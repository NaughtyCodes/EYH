import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Story } from '../models/story';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { 

  }

 

}
