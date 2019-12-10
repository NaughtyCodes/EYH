import { Component, OnInit } from '@angular/core';

import {TreeNode} from 'primeng/api';
import { MenuhandlerService } from 'src/app/service/menuhandler.service';

@Component({
  selector: 'app-storyview',
  templateUrl: './storyview.component.html',
  styleUrls: ['./storyview.component.css']
})
export class StoryviewComponent implements OnInit {

  files: TreeNode[];

  constructor(private menuhandlerService: MenuhandlerService) { }

  ngOnInit() {
    this.menuhandlerService.getFiles().subscribe(data => {
      this.files = <TreeNode[]> data['data'];
      console.log(JSON.stringify(data));
    });
  }

}
