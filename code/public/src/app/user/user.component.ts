/**
 * Created by cant on 12/7/16.
 */
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'user',
  templateUrl: './user.component.html'
})
export class UserComponent {

  selectedDateString: string;
  selectedDate: Date = new Date();

  constructor (private router: Router, private route: ActivatedRoute) {
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
  }

  toIsoString(date) {
    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }
    return date.getUTCFullYear() +
      '-' + pad(date.getUTCMonth() + 1) +
      '-' + pad(date.getUTCDate())
  }

  onDateSelected() {
    console.log('user component date selected');
    this.selectedDateString = this.toIsoString(this.selectedDate);
  }
}
