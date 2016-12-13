/**
 * Created by cant on 12/7/16.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';

import 'rxjs/Observer';

import {Subject} from 'rxjs/Subject';

import { Credential } from '../_models/Credential';

@Injectable()
export class AuthService {
  private loginUrl = 'http://http://ec2-35-156-178-210.eu-central-1.compute.amazonaws.com:5000/api/auth';

  private registerUrl = 'http://http://ec2-35-156-178-210.eu-central-1.compute.amazonaws.com:5000/api/auth/new';

  constructor (private http: Http) {}

  // private credential = new Subject<Credential>()
  // public credentialAnnouncer = this.credential.asObservable();

  public login(user) : Observable<Response> {
    console.log('authServ login');
    return this.http.post(this.loginUrl, user)
      .map(this.verifyLogin)
      .catch(this.handleLoginError);
  }

  private verifyLogin(res: Response) {
    let body = res.json();

    // this.credentialAnnouncer.next(new Credential(body["Email"], body["Id"], true))

    return body;
  }

  public logout() {
    // this.credentialAnnouncer.next(new Credential('', '', false))
  }

  public register(user) : Observable<Response> {
    console.log('authServ register');
    return this.http.post(this.registerUrl, user)
      .map(this.registerRecieved)
      .catch(this.handleLoginError);
  }

  registerRecieved(res: Response) {
    let body = res.json();

    // this.credentialAnnouncer.next(new Credential(body["Email"], body["Id"], true))

    return body;
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
