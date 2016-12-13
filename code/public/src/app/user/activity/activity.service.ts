/**
 * Created by cant on 12/13/16.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Activity } from '../../_models/Activity'
import { ActivityMet } from '../../_models/ActivityMet'

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';

@Injectable()
export class ActivityService {
  private backendUrl = 'http://127.0.0.1:5000/api/user/';
  private activityUrl = '/activity/';

  constructor(public http: Http) {

  }

  public getActivities(userId, selectedDate) {
      console.log('GET foods serv');
      return this.http.get(this.backendUrl + userId + this.activityUrl + selectedDate)
        .map(this.onActivityReceived)
        .catch(this.handleError);
  }

  private onActivityReceived(res: Response) {
    let body = res.json();
    return body.map(x => new Activity(x["Name"], x["Duration"], x["CalorieBurned"], x["Date"]));
  }

  getActivitySuggestions(weight) {
    console.log('Get Mets');
    return this.http.get('/assets/mets.json')
      .map(this.onActivitySuggestionResults)
      .catch(this.handleError);

  }

  private onActivitySuggestionResults(res: Response) {
    let body = res.json();
    return body.map(x => new ActivityMet(x["description"], x["met"]));
  }

  public postActivity(userId, new_activity) {
    console.log('post activity service: ', JSON.stringify(new_activity));
    return this.http.post(this.backendUrl + userId + this.activityUrl + 'new', new_activity)
      .map(this.onActivityRegistered)
      .catch(this.handleError);
  }

  private onActivityRegistered(res: Response) {
    let body = res.json();
    console.log('activity registered response: ', body);
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
