/**
 * Created by cant on 12/10/16.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';

import 'rxjs/add/operator/map';

@Injectable()
export class FoodSuggestionService {

  private backendUrl = 'http://127.0.0.1:5000/api/food/';

  constructor (private http: Http) {}

  public getNDBFoodSuggestion(search_string) : Observable<Response> {
    console.log('get foods serv');
    return this.http.get(this.backendUrl + search_string)
      .map(this.onNDBFoodSuggestionReceived)
      .catch(this.handleError);
  }
  private onNDBFoodSuggestionReceived(res: Response) {
    let body = res.json();
    return body.map(x => x["name"]);
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
