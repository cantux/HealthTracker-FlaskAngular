/**
 * Created by cant on 12/12/16.
 */
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';

import { ActivityService } from './activity.service';

import { Activity } from '../../_models/Activity';
import { ActivityMet } from '../../_models/ActivityMet'

@Component({
  selector: 'activity',
  templateUrl: 'activity.component.html'
})
export class ActivityComponent implements OnInit {
  private routeSubscription;
  private userId;
  activities: Activity[];

  constructor(private route: ActivatedRoute,
              private activityService: ActivityService) {
    console.log('activity compoenent constr');
  }

  ngOnInit() {
    console.log('activity compoenent ngoninit');
    this.routeSubscription = this.route.params.subscribe(params => {
      this.userId = params['id']; // (+) converts string 'id' to a number
      this.activityService.getActivities(this.userId, this.selectedDate).subscribe(
        x => {
          console.log('activities received: ', JSON.stringify(x));
          this.activities = x;
        }
      )
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  selectedDate: string;

  @Input()
  set masterDateString(masterDateString: string) {
    console.log('food component date selected: ', masterDateString);
    this.selectedDate = masterDateString || 'no date selected';

    if(this.userId)
    {
      this.activityService.getActivities(this.userId, this.selectedDate).subscribe(
        x => {
          console.log('activities received on date change: ', JSON.stringify(x));
          this.activities = x;
        });
    }
  }

  // food search autocomplete
  activitySearchQuery: string;
  activityNameSearchResults: string[];
  activitySearchResults: ActivityMet[];

  activitySearch(event) {
    this.activityNameSearchResults = ['Loading...'];
    this.activityService.getActivitySuggestions(event.query).subscribe(
      suggestion => {
        this.activitySearchResults = suggestion;
        this.activityNameSearchResults = suggestion.map(
          searchResults => {
            return searchResults.Name;
          }
        );
      }
    );
  }

  // calculate
  selectedActivityName: string;
  selectedActivityMet: number;
  onActivitySelected(value) {
    this.selectedActivityName = value;
    Observable.from(this.activitySearchResults).find(item => {
      return item.Name === value;
    }).subscribe(
      result => {
        this.selectedActivityName = result.Name;
        this.selectedActivityMet = result.Met;
      }
    )
  }

  // duration input text
  durationInputText: string;

  onActivityAddButtonClicked() {
    let duration = +(this.durationInputText);
    let calorie = duration  * this.selectedActivityMet * 65 / 60;
    console.log('activity component calorie: ', calorie)
    let new_activity = new Activity(this.selectedActivityName,
      duration,
      calorie,
      this.selectedDate);

    this.activities.unshift(new_activity);
    this.activityService.postActivity(this.userId, new_activity).subscribe(
      x => {
        console.log('activity component activity posted: ', x);
      }
    );
  }
}
