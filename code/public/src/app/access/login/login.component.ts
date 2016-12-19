/**
 * Created by cant on 12/6/16.
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

import { UserDetail } from '../../_models/UserDetail';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginCompUsed: boolean = false;

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {
    console.log('login comp constr');
  }

  ngOnInit() {
    console.log('login comp ngoninit');

    this.authService.credentialObservable.subscribe(
      res => {

        console.log('login comp cred obs ngoninit: ', res);

        if(res['Id'] && this.loginCompUsed) {
          this.router.navigate(['/user', res['Id']])
        }
        else {
          console.log('wrong response object recieved or prevented double routing');
        }
      },
      err => console.log(err)
    );
  }


  tryLogin()
  {
    console.log('tryLogin');
    this.loginCompUsed = true;
    this.authService.login(new UserDetail(this.email, this.password));
  }
}
