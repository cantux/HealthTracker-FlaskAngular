/**
 * Created by cant on 12/6/16.
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

import { User } from '../../_models/User';

@Component({
  selector: 'register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  user: User = new User('','');

  constructor(private authService: AuthService, private router: Router) {
    console.log('register component constr');
  }

  ngOnInit() {
    console.log('register component ngoninit');
  }

  tryRegister(user: User) {
    console.log('tryRegister');
    this.authService.register(user).subscribe(
      res => {
        console.log(res)
        if(res['Id']) {
          this.router.navigate(['/user', res['Id']])
        }
        else {
          console.log('email already exists');
        }
      },
      err => console.log(err)
    );
  }
}
