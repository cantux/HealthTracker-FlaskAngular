/**
 * Created by cant on 12/9/16.
 */

import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';

import { Weight } from '../../_models/Weight';

@Injectable()
export class WeightService {

  private backendUrl = 'http://localhost:5000/api/user/';
  private weightApiUrl = '/weight/';
  constructor (private http: Http) {}

  public putWeightByDate(id, selectedDate, weight): Observable<Weight> {
    console.log('post weight by date serv');
    return this.http.put(this.backendUrl + id + this.weightApiUrl + selectedDate, weight)
      .map(this.onWeightPosted)
      .catch(this.handleWightError);
  }

  private onWeightPosted(res: Response) {
    let body = res.json();
    return new Weight(body["Weight"], body["Date"]);
  }

  public getWeightByDate(id, selectedDate): Observable<Weight> {
    console.log('get weight by date serv');
    return this.http.get(this.backendUrl + id + this.weightApiUrl + selectedDate)
      .map(this.onWeightByDateRecieved)
      .catch(this.handleWightError);
  }

  private onWeightByDateRecieved(res: Response) {
    if(res.status == 204)
    {
      return new Weight(0,'');
    }
    let body = res.json();
    return new Weight(body["Weight"], body["Date"]);
  }

  public getWeights(id, startDate, endDate) : Observable<Response> {
    console.log('get weight interval serv');
    return this.http.get(this.backendUrl + id + this.weightApiUrl + startDate + '/' + endDate)
      .map(this.onWeightIntervalRecieved)
      .catch(this.handleWightError);
  }

  private onWeightIntervalRecieved(res: Response) {
    let body = res.json();
    return body;
  }

  private handleWightError(error: Response) {
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
