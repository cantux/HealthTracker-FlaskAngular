/**
 * Created by cant on 12/6/16.
 */
import { Component } from '@angular/core';

@Component({
  selector: 'register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  constructor() {
    console.log('register component constr');
  }

  ngOnInit() {
    console.log('register component ngoninit');
  }
}
