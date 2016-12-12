/**
 * Created by cant on 12/10/16.
 */
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';

import { SelectItem } from 'primeng/primeng';

import { FoodSuggestionService } from './food.suggestion.service'
import { FoodProviderService } from './food.provider.service'

import { NdbFood } from '../../_models/NdbFood';
import { Measure } from '../../_models/Measure';

@Component({
    selector: 'food',
    templateUrl: 'food.component.html',
})
export class FoodComponent implements OnInit {
  constructor(private foodSuggestionService: FoodSuggestionService,
              private foodProviderService: FoodProviderService) {
    console.log('food component constr');
    this.foods.push(new NdbFood('1', 'apple'));
    this.foods.push(new NdbFood('1', 'apple'));
    this.foods.push(new NdbFood('1', 'apple'));
    this.foods.push(new NdbFood('1', 'apple'));
    this.foods.push(new NdbFood('1', 'apple'));
  }

  ngOnInit() {
    console.log('food component ngoninit');
    this.foodProviderService.test().subscribe(
      x => {
        console.log('just kill me if this works');
      });
  }

  // datalist

  foods: NdbFood[] = [];

  // calendar
  selectedDate: Date = new Date();

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

  onDateSelected() {
    console.log('food component date selected');
  }

}
