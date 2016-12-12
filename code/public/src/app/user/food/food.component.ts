/**
 * Created by cant on 12/10/16.
 */
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';

import { SelectItem } from 'primeng/primeng';

import { FoodSuggestionService } from './food.suggestion.service';
import { FoodProviderService } from './food.provider.service';
import { ConsumptionService } from './consumption.service';
import { AuthService } from '../../access/auth.service';

import { NdbFood } from '../../_models/NdbFood';
import { Food } from '../../_models/Food';

@Component({
    selector: 'food',
    templateUrl: 'food.component.html',
})
export class FoodComponent implements OnInit {

  private routeSubscription;
  private userId;
  constructor(private foodSuggestionService: FoodSuggestionService,
              private foodProviderService: FoodProviderService,
              private consumptionService: ConsumptionService,
              private route: ActivatedRoute,
              private authService: AuthService) {
    console.log('food component constr');
  }

  ngOnInit () {
    console.log('food component ngoninit: Selected Date: ', this.selectedDate);
    this.routeSubscription = this.route.params.subscribe(params => {
      this.userId = params['id']; // (+) converts string 'id' to a number
      console.log('route subs userid: ', this.userId);
      this.foodProviderService.getFoods(this.userId, this.selectedDate).subscribe(
        x => {
          console.log('foods received: ', JSON.stringify(x));
          this.foods = x;
        }
      )
    });
    //
    // this.authService.credentialObs.subscribe(
    //   cred => console.log('food component cred: ', JSON.stringify(cred))
    // )
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

  // datalist
  foods: NdbFood[] = [];

  // food search autocomplete
  foodSearchQuery: string;
  foodNameSearchResults: string[];
  foodSearchResults: NdbFood[];

  // measures
  foodMeasures: SelectItem[];
  selectedMeasureLabel: string = 'Select Label';

  // quantity input text
  quantityInputText: string;
  quantityInputDisabled: boolean = false;

  // consume
  selectedFoodName: string;
  selectedFoodNdbNumber: string;

  foodSearch(event) {
    this.foodNameSearchResults = ['Loading...'];
    this.foodSuggestionService.getNdbFoodSuggestion(event.query).subscribe(
      suggestion => {
        this.foodSearchResults = suggestion;
        this.foodNameSearchResults = suggestion.map(
          searchResults => {
              return searchResults.Name;
          }
        );
      }
    );
  }

  onFoodSelected(value) {
    this.foodMeasures = <SelectItem[]>[{ label:'Loading..', value:''}];
    Observable.from(this.foodSearchResults).find(function(item) {
      return item.Name === value;
    }).subscribe(
      result => {
        this.selectedFoodNdbNumber = result.NdbNumber;
        this.selectedFoodName = result.Name;
        this.foodProviderService.getFoodMeasureLabels(result.NdbNumber).subscribe(
          measures => {
            this.foodMeasures = measures.map(
              m => {
                return { label: m.Label + " " + m.Eqv, value: m.Label };
              }
            );
          }
        )
      }
    )
  }

  onFoodAddButtonClicked() {
    let new_food = new Food(this.selectedFoodName,
      this.selectedMeasureLabel,
      this.selectedFoodNdbNumber,
      +(this.quantityInputText),
      this.selectedDate);

    this.consumptionService.consumeFood(this.userId, new_food).subscribe(
      x => {
        this.foods.unshift(x);
        console.log('food component consumed food name: ', x);
      });
  }
}
