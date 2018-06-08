/**
 * Created by cant on 12/7/16.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';

import { UserCredential } from '../_models/UserCredential';
import { UserDetail } from '../_models/UserDetail';

@Injectable()
export class AuthService {
  private loginUrl = 'http://localhost:5000/api/auth';

  private registerUrl = 'http://localhost:5000/api/auth/new';

  // Observable navItem source
  private actualCredential = new ReplaySubject<UserCredential>();
  // Observable navItem stream
  credentialObservable = this.actualCredential.asObservable();

  constructor (private http: Http) {
    let userCredential: UserCredential = JSON.parse(localStorage.getItem('userCredential'))
                                                                    || new UserCredential('','');
    this.actualCredential.next(userCredential);
  }

  public login(user: UserDetail) {
    console.log('authServ login');

    this.http.post(this.loginUrl, user)
      .map(this.verifyLogin)
      .catch(this.handleLoginError).subscribe(x => {
      localStorage.setItem('userCredential', JSON.stringify(x));
      this.actualCredential.next(x);
    })
  }

  private verifyLogin(res: Response) {
    let body = res.json();
    return new UserCredential(body["Email"], body["Id"], true);
  }

  public logout() {
    localStorage.removeItem('userCredential');
    this.actualCredential.next(new UserCredential('', ''));
  }

  public register(userDetail: UserDetail) {
    console.log('authServ register');

    this.http.post(this.registerUrl, userDetail)
      .map(this.registerRecieved)
      .catch(this.handleLoginError).subscribe(receivedUserCredential => {
      localStorage.setItem('userCredential', JSON.stringify(receivedUserCredential));
      this.actualCredential.next(receivedUserCredential)
    })
  }

  registerRecieved(res: Response) {
    let body = res.json();
    return new UserCredential(body["Email"], body["Id"], true);
  }

  private handleLoginError(error: Response) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = JSON.stringify(error);
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
