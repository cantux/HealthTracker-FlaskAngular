/**
 * Created by cant on 12/13/16.
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProfileService } from './profile.service'

import { UserDetailService } from '../../user/user.detail.service'

import { UserDetail } from '../../_models/UserDetail';

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {

  private routeSubscription;
  userId: string;
  user: UserDetail;

  constructor(private route: ActivatedRoute,
              private profileService: ProfileService,
              private userDetailService: UserDetailService) {
    console.log('profile component constr');
  }

  ngOnInit() {
    console.log('profile component ngoninit');
    this.routeSubscription = this.route.params.subscribe(params => {
      this.userId = params['id']; // (+) converts string 'id' to a number
      console.log('route subs userid: ', this.userId);
      this.userDetailService.getDetails(this.userId).subscribe(x => {
        this.user = x;
      })
    });
  }

  onProfileSubmit(){
    this.profileService.putUserDetails(this.userId, this.user).subscribe(x => {
      this.user = x
    });
  }

}
