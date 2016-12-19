/**
 * Created by cant on 12/7/16.
 */
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../access/auth.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html'
})
export class UserComponent {

  selectedDateString: string;
  selectedDate: Date = new Date();

  constructor (private router: Router,
               private route: ActivatedRoute,
               public authService: AuthService) {
    console.log('user component constr');
    this.selectedDateString = this.toIsoString(this.selectedDate);
  }

  ngOnInit () {
    console.log('user component ngoninit');
    this.route.data.subscribe((data: {userDetail}) =>
      {
        console.log('user component user detail recieved: ', data.userDetail);
      }
    );

    this.authService.credentialObservable.subscribe(x => {
      console.log('user component credential observable changed: ', JSON.stringify(x));
    })
  }

  toIsoString(date) {
    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }
    let x = date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate())
    return x;
  }

  onDateSelected() {
    console.log('user component date selected');
    this.selectedDateString = this.toIsoString(this.selectedDate);
  }
}
