/**
 * Created by cant on 12/12/16.
 */
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'exercise',
  templateUrl: 'exercise.component.html'
})
export class ExerciseComponent implements OnInit {
  private routeSubscription;
  private userId;

  constructor(private route: ActivatedRoute) {
    console.log('execise compoenent constr');
  }

  ngOnInit() {
    console.log('execise compoenent ngoninit');
    this.routeSubscription = this.route.params.subscribe(params => {
      this.userId = params['id']; // (+) converts string 'id' to a number
      // TODO: add getting foods here.
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
  }

}
