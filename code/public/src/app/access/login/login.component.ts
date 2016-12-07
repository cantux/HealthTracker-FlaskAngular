/**
 * Created by cant on 12/6/16.
 */
import { Component } from '@angular/core';
//import { HttpModule } from '@angular/http';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  someText = 'login text';

  constructor() {
    console.log('login comp constr');
  }

  ngOnInit() {
    console.log('login comp ngoninit');
  }
}
