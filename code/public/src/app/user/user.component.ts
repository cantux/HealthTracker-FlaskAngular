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
  constructor (private router: Router, private route: ActivatedRoute) {
    console.log('user component constr');
  }

  ngOnInit () {
    console.log('user component ngoninit');
    this.route.data.subscribe((data: {userDetail}) =>
      {
        console.log('user component user detail recieved: ', data.userDetail);
      }
    );
  }
}
