/**
 * Created by cant on 12/6/16.
 */
import { Component } from '@angular/core';

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
    console.log('access overlay component ngoninit');
  }
}
