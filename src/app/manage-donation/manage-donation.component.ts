import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-donation',
  templateUrl: './manage-donation.component.html',
  styleUrls: ['./manage-donation.component.css']
})
export class ManageDonationComponent implements OnInit {

  private title:string;

  constructor( private route:ActivatedRoute, private router: Router
    ) {
      this.title = route.snapshot.data['title']; 
    }

  ngOnInit() {
  }

}
