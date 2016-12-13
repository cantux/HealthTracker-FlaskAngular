/**
 * Created by cant on 12/6/16.
 */
import { Component } from '@angular/core';

// import { AuthService } from './auth.service'

@Component({
  selector: 'access',
  templateUrl: './access.component.html'

})
export class AccessComponent {
  someText = 'access overlay text'
  constructor () {
    console.log('access overlay component constr');
  }

  ngOnInit () {
    // this.authService.credentialAnnouncer.subscribe(x => {
    //   console.log(JSON.stringify(x));
    // })
    console.log('access overlay component ngoninit');
  }
}
