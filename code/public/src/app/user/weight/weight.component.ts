/**
 * Created by cant on 12/9/16.
 */
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WeightService } from './weight.service'

@Component({
  selector: 'weight',
  templateUrl: './weight.component.html',
  providers: [ WeightService ]
})
export class WeightComponent {
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public weightArray: any[];

  private routeSubscription: any;
  private userId: any;

  constructor (private weightService: WeightService, private route: ActivatedRoute) {
    console.log('weight component constr');
    this.startDate.setDate(this.startDate.getDate() - 30);
  }

  ngOnInit () {
    console.log('weight component ngoninit');
    this.routeSubscription = this.route.params.subscribe(params => {
      this.userId = params['id']; // (+) converts string 'id' to a number
      //
      // this.weightService.getWeights(this.userId,
      //                               this.toIsoString(this.startDate),
      //                               this.toIsoString(this.endDate))
      //   .subscribe(res => {
      //       console.log('weight component, service response: ', res);
      //     },
      //     err => {
      //       console.log('weight component, service error: ', err);
      //     })
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

  toIsoString(date) {
    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate())
  }

  onDateSelected() {
    console.log('weight component date selected');
    // this.weightService.getWeights(this.userId, this.toIsoString(this.startDate), this.toIsoString(this.endDate))
    //   .subscribe(
    //     res => {
    //       console.log('weight component, service response: ', res);
    //     },
    //     err => {
    //       console.log('weight component, service error: ', err);
    //     })
  }
}
