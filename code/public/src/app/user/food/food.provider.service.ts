/**
 * Created by cant on 12/11/16.
 */

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';

import { Measure } from '../../_models/Measure';

@Injectable()
export class FoodProviderService {

  private backendUrl = 'http://127.0.0.1:5000/api/food/';

  private measuresUrl = '/measures';

  constructor (private http: Http) {}

  public test (): Observable<any>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let x = { "Name": "Cheddar", "MeasureLabel": "oz", "NdbNumber": "01009", "Quantity": 1,"Date": "2016-12-12"};
    console.log(JSON.stringify(x));
    return this.http.post('http://127.0.0.1:5000/api/user/1/food/new', x)
      .map(x => console.log(x.json))
      .catch(this.handleError);
  }
  public getFoodMeasureLabels(ndbno) : Observable<Measure[]> {
    console.log('GET foods serv');
    return this.http.get(this.backendUrl + ndbno + this.measuresUrl)
      .map(this.onFoodMeasuresReceived)
      .catch(this.handleError);
  }

  private onFoodMeasuresReceived(res: Response) {
    let body = res.json();
    return body.map(x => new Measure(x["value"], x["label"], x["eqv"]));
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
