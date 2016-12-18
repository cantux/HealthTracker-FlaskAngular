/**
 * Created by cant on 12/6/16.
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

import { UserDetail } from '../../_models/UserDetail';

@Component({
  selector: 'register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerComponentUsed: boolean = false;
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {
    console.log('register component constr');
  }

  ngOnInit() {
    console.log('register component ngoninit');

    this.authService.credentialObservable.subscribe(
      res => {
        console.log('register comp cred obs ngoninit: ', res);
        if(res['Id'] && this.registerComponentUsed) {
          this.router.navigate(['/user', res['Id']])
        }
        else {
          console.log('email already exists or prevent double routing');
        }
      },
      err => console.log('register component credential observable: ', err)
    );
  }

  tryRegister() {
    console.log('tryRegister');
    this.registerComponentUsed = true;
    this.authService.register(new UserDetail(this.email, this.password))
  }
}
