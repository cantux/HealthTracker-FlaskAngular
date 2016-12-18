/**
 * Created by cant on 12/13/16.
 */
import { Component, OnInit } from '@angular/core';

import { UserDetailService } from '../../user/user.detail.service'

import { UserDetail } from '../../_models/UserDetail';

// import { Router, ActivatedRoute } from '@angular/router';
// this.routeSubscription = this.route.params.subscribe(params => {
//   this.userId = params['id']; // (+) converts string 'id' to a number
//
@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {

  userId: string;
  user: UserDetail;

  constructor(private userDetailService: UserDetailService) {
    console.log('profile component constr');
  }

  ngOnInit() {
    console.log('profile component ngoninit');

    console.log('route subs userid: ', this.userId);
    this.userDetailService.getDetails(this.userId).subscribe(x => {
      this.user = x;
    })
  }
  //
  // onSubmit() {
  // this.userDetailService.putUserDetails(this.userId, this.user).subscribe(x => {
  //     this.user = new UserDetail()
  //   });
  // }

}
