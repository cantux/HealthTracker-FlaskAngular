/**
 * Created by cant on 12/18/16.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'logout',
  templateUrl: 'logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
    console.log('logout component constr');
  }

  ngOnInit() {
    console.log('logout component ngoninit');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
