/**
 * Created by cant on 12/13/16.
 */
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { UserDetailService } from '../../user/user.detail.service'

import { UserDetail } from '../../_models/UserDetail';

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {

  userId: string;
  user: UserDetail = new UserDetail();

  constructor(private authService: AuthService, private userDetailService: UserDetailService) {
    console.log('profile component constr');
  }

  ngOnInit() {
    console.log('profile component ngoninit');

    this.authService.credentialObservable.subscribe(params => {
      this.userId = params.Id; // (+) converts string 'id' to a number
      if(!this.userId && this.userId !== ''){
        this.userDetailService.getDetails(this.userId).subscribe(x => {
          this.user = x;
        })
      }
    });
  }

  onSubmit() {
    this.userDetailService.putUserDetails(this.userId, this.user).subscribe(x => {
        this.user = new UserDetail()
      });
  }

}
