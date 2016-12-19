/**
 * Created by cant on 12/6/16.
 */
import { Component } from '@angular/core';

import { AuthService } from './auth.service'

@Component({
  selector: 'access',
  templateUrl: './access.component.html'

})
export class AccessComponent {

  private isLoggedIn: boolean = false;
  private userId;
  constructor (private authService: AuthService) {
    console.log('access overlay component constr');
  }

  ngOnInit () {
    console.log('access overlay component ngoninit');
    this.authService.credentialObservable.subscribe(params => {
      console.log('is logged in: ', params.IsLoggedIn)
      this.isLoggedIn = params.IsLoggedIn;
      this.userId = params.Id;
    });
  }
}
