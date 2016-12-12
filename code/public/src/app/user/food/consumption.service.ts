/**
 * Created by cant on 12/12/16.
 */

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';

import { AuthService } from  '../../access/auth.service'

import { Measure } from '../../_models/Measure';
import { Food } from '../../_models/Food';

@Injectable()
export class ConsumptionService {

  private backendUrl = 'http://ec2-35-156-178-210.eu-central-1.compute.amazonaws.com:5000/api/user/';

  private foodUrl = '/food/new';

  constructor (private http: Http, private authService: AuthService) {}

  public consumeFood(userId: string, food: Food): Observable<any> {
    //
    // this.authService.credentialObs.subscribe(
    //   cred => {
    //     console.log('cred: ', JSON.stringify(cred))
    //   });
    // console.log(this.backendUrl + this.authService.credential.Id + this.foodUrl);
    console.log('consume food service: ', food);
    return this.http.post(this.backendUrl + userId + this.foodUrl, food)
      .map(this.onConsumedRegistered)
      .catch(this.handleError);
  }

  private onConsumedRegistered(res: Response) {
    let body = res.json();
    return body;
  }

  private handleError(error: Response) {
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
