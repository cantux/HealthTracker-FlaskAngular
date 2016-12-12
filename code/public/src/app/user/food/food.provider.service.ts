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
import { Food } from '../../_models/Food';

@Injectable()
export class FoodProviderService {

  private measuresBackendUrl = 'http://127.0.0.1:5000/api/food/';
  private measuresUrl = '/measures';

  private foodBackendUrl = 'http://127.0.0.1:5000/api/user/';
  private getSelectedDateFoodUrl = '/food/'

  constructor (private http: Http) {}

  public getFoods(user_id, date): Observable<Food[]> {
    console.log('GET foods serv');
    return this.http.get(this.foodBackendUrl + user_id + this.getSelectedDateFoodUrl + date)
      .map(this.onFoodReceived)
      .catch(this.handleError);
  }

  private onFoodReceived(res: Response) {
    let body = res.json();
    return body.map(x => new Food(x["Name"], x["MeasureLabel"], x["NdbNumber"], x["Quantity"], x["Date"]));
  }


  public getFoodMeasureLabels(ndbno) : Observable<Measure[]> {
    console.log('GET measures serv');
    return this.http.get(this.measuresBackendUrl + ndbno + this.measuresUrl)
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
