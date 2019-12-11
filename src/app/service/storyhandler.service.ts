import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TreeNode } from 'primeng/api/treenode';


@Injectable({
  providedIn: 'root'
})
export class StoryhandlerService {

  constructor(
    private http: HttpClient,
    private router: Router 
    ) { }

    getStorys() {
      return this.http.get('./assets/mock/storys.json');
    }

}
