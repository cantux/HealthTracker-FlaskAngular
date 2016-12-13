/**
 * Created by cant on 12/13/16.
 */
import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';

import { UserDetail } from '../../_models/UserDetail';

@Injectable()
export class ProfileService {

  constructor (private http: Http) {}

  private backendUrl = "http://ec2-35-156-178-210.eu-central-1.compute.amazonaws.com:5000/api/user/";
  putUserDetails(userId, userDetails) : Observable<UserDetail> {
    return this.http.put(this.backendUrl + userId, userDetails)
      .map(this.onUserDetailRecieved)
      .catch(this.handleUserDetailError);
  }

  private onUserDetailRecieved(res: Response) {
    let body = res.json();
    return new UserDetail(body["Password"], body["Name"], body["Surname"], body["Height"]);
  }

  private handleUserDetailError(error: Response) {
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
