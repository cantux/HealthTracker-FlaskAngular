/**
 * Created by cant on 12/6/16.
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

import { User } from '../../_models/User';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  providers: [ AuthService ]
})
export class LoginComponent {
  user: User = new User('','');
  constructor(private authService: AuthService, private router: Router) {
    console.log('login comp constr');
  }

  ngOnInit() {
    console.log('login comp ngoninit');
  }

  tryLogin(user: User) {
    console.log('tryLogin');
    this.authService.login(user).subscribe(
      res => {
        console.log(res)
        if(res['id']) {
          this.router.navigate(['/user', res['id']])
        }
      },
          err => console.log(err)
      );
  }
}
