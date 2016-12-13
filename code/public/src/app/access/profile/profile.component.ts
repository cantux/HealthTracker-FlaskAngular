/**
 * Created by cant on 12/13/16.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {

  private routeSubscription;
  userId: string;

  constructor(private route: ActivatedRoute) {
    console.log('profile component constr');
  }

  ngOnInit() {
    console.log('profile component ngoninit');
    this.routeSubscription = this.route.params.subscribe(params => {
      this.userId = params['id']; // (+) converts string 'id' to a number
      console.log('route subs userid: ', this.userId);
    });
  }

}
