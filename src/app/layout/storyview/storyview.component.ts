import { Component, OnInit } from '@angular/core';

import { TreeNode } from 'primeng/api';
import { MenuhandlerService } from 'src/app/service/menuhandler.service';
import { SessionService } from 'src/app/service/session.service';
import { Story } from 'src/app/models/story';

@Component({
  selector: 'app-storyview',
  templateUrl: './storyview.component.html',
  styleUrls: ['./storyview.component.css']
})
export class StoryviewComponent implements OnInit {

  files: TreeNode[];
  routeParam: any;
  stories: any;
  story: Story;

  constructor(
      private menuhandlerService: MenuhandlerService,
      private sessionService: SessionService
    ) {}

  ngOnInit() {

    this.routeParam = JSON.parse(this.sessionService.getParamObj());
    //this.routeParam = AppInjector.get(SessionService).getParamObj();
     this.stories    = this.routeParam["stories"];
     this.story      = this.routeParam["story"];
     console.log(JSON.stringify(this.story));

    this.menuhandlerService.getFiles().subscribe(data => {
      this.files = <TreeNode[]> data['data'];
      //console.log(JSON.stringify(data));
    }, 
    errorCode => {
      console.log(errorCode);
    });

  }

}
