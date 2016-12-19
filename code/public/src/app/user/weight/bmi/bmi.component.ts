/**
 * Created by cant on 12/13/16.
 */
import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';

import { AuthService } from '../../../access/auth.service';

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
  weight: Weight = new Weight(0,'');
  height: number;
  weightInputText: string;

  Bmi: any = "Enter weight to see your BMI!!";

  constructor(private authService: AuthService,
              private weightService: WeightService,
              private userDetailService: UserDetailService) {
    console.log('bmi component constr');
  }

  ngOnInit() {
    console.log('bmi component ngoninit');
    this.authService.credentialObservable.subscribe(params => {
      this.userId = params.Id; // (+) converts string 'id' to a number
      console.log('bmi component auth service userid: ', this.userId);
      if(this.userId && this.userId !== ''){
        this.updateDate()
      }
    });
  }

  selectedDate: string;

  @Input()
  set masterDateString(masterDateString: string) {
    console.log('bmi component date selected: ', masterDateString);
    this.selectedDate = masterDateString || 'no date selected';
    if(this.userId && this.userId !== '' && this.selectedDate !== 'no date selected')
    {
      this.updateDate();
    }
  }

  onWeightAddButtonClicked () {
    this.weightService.putWeightByDate(this.userId,
                              this.selectedDate,
                              new Weight(+(this.weightInputText), this.selectedDate)).subscribe(
      x=> {
        if(x) {
          this.weight = x;
          this.height = 177;
          let heightMultiplier = this.height / 100;
          if(!this.height)
          {
            this.Bmi = 'Enter Height from Profile to Calculate BMI';
          }
          if(!this.weight || !this.weight.Weight || this.weight.Weight === 0)
          {
            this.Bmi = 'Enter Weight to Calculate BMI';
          }
          else
          {
            this.Bmi = this.weight.Weight / (heightMultiplier * heightMultiplier);
          }
        }
      }
    )
  }

  updateDate() {
    console.log('update date');
    this.weightService.getWeightByDate(this.userId, this.selectedDate).subscribe(
      x => {
        if(x) {
          console.log('weight received: ', JSON.stringify(x));
          this.weight = x;
        }
      }
    )

    this.userDetailService.getDetails(this.userId).subscribe(x => {
      this.height = 177;
      let heightMultiplier = this.height / 100;
      if(!this.height)
      {
        this.Bmi = 'Enter Height from Profile to Calculate BMI';
      }
      if(!this.weight || !this.weight.Weight || this.weight.Weight === 0)
      {
        this.Bmi = 'Enter Weight to Calculate BMI';
      }
      else
      {
        this.Bmi = this.weight.Weight / (heightMultiplier * heightMultiplier);
      }
    })
  }
}
