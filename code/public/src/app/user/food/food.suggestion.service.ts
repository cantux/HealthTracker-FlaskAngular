/**
 * Created by cant on 12/10/16.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { NdbFood } from '../../_models/NdbFood';

@Injectable()
export class FoodSuggestionService {

    private backendUrl = 'http://127.0.0.1:5000/api/food/';

    constructor (private http: Http) {}

    public getNdbFoodSuggestion(search_string) : Observable<NdbFood[]> {
        console.log('FIND foods serv');
        return this.http.get(this.backendUrl + search_string)
                      .map(this.onNdbFoodSuggestionReceived)
                      .catch(this.handleError);
    }
    private onNdbFoodSuggestionReceived(res: Response) {
        let body = res.json();
        return body.map(x => new NdbFood(x["ndbno"], x["name"]));
    }

    private handleError(error: Response) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        }
        else {
            errMsg = JSON.stringify(error);
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }


}
