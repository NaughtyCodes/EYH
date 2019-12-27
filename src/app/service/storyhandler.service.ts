import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TreeNode } from 'primeng/api/treenode';
import { AngularFirestore } from '@angular/fire/firestore';
import { Story } from '../models/story';

@Injectable({
  providedIn: 'root'
})
export class StoryhandlerService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private firestore: AngularFirestore 
    ) { }

    storyMapper(data: any): Story[] {
      return data.map(e => {
        return {
          id: e.payload.doc.id,
          hasImage: e.payload.doc.data()['hasImage'],  
          imageData: e.payload.doc.data()['imageData'],  
          storyTitle: e.payload.doc.data()['storyTitle'],  
          story: e.payload.doc.data()['story'],  
          timestamp: e.payload.doc.data()['timestamp']   
        } as Story;
      });
    }

    getStories() {
      return this.firestore.collection('eyh-stories').snapshotChanges();
    }
  
    createStory(story: Story){
      //console.log(JSON.parse(JSON.stringify(story)));
      return this.firestore.collection('eyh-stories').add(story);
    }
  
    updateStory(story: Story){
      delete story.id;
      return this.firestore.doc('eyh-stories/' + story.id).update(story);
    }
  
    deleteStory(storyId: string){
      return this.firestore.doc('eyh-stories/' + storyId).delete();
    }

}
