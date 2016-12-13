/**
 * Created by cant on 12/13/16.
 */
import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WeightService } from '../weight.service';
import { UserDetailService } from '../../user.detail.service';

import { Weight } from '../../../_models/Weight';

@Component({
  selector: 'bmi',
  templateUrl: 'bmi.component.html'
})
export class BmiComponent implements OnInit {

  private routeSubscription;
  userId: string;
  weight: Weight;
  height: number;
  weightInputText: string;

  Bmi: any = "Enter weight to see your BMI!!";

  constructor(private route: ActivatedRoute,
              private weightService: WeightService,
              private userDetailService: UserDetailService) {
    console.log('bmi component constr');
  }

  ngOnInit() {
    console.log('bmi component ngoninit');
    this.routeSubscription = this.route.params.subscribe(params => {
      this.userId = params['id']; // (+) converts string 'id' to a number
      console.log('route subs userid: ', this.userId);
      this.weightService.getWeightByDate(this.userId, this.selectedDate).subscribe(
        x => {
          console.log('activities received: ', JSON.stringify(x));
          this.weight = x;
        }
      )

      this.userDetailService.getDetails(this.userId).subscribe(x => {
        this.height = x["Height"];
        this.Bmi = this.weight.Weight / (this.height * this.height);
      })
    });
  }

  selectedDate: string;

  @Input()
  set masterDateString(masterDateString: string) {
    console.log('food component date selected: ', masterDateString);
    this.selectedDate = masterDateString || 'no date selected';
  }

  onWeightAddButtonClicked () {
    this.weightService.postWeightByDate(this.userId, this.selectedDate, +(this.weightInputText)).subscribe(
      x=> {
        this.weight = x;
        this.Bmi = x["Weight"] / (this.height * this.height)
      }
    )
  }
}
