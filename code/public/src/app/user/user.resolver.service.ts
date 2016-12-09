/**
 * Created by cant on 12/7/16.
 */
import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { UserDetailService } from './user.detail.service';

@Injectable()
export class UserResolver implements Resolve<any>{
  constructor (private userDetailService: UserDetailService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userDetailService.getDetails(route.params['id']);
  }
}

export const USER_RESOLVER_PROVIDERS = [
  UserResolver
]
