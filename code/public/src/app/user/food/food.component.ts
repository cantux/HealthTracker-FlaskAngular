/**
 * Created by cant on 12/10/16.
 */
import { Component, OnInit } from '@angular/core';

import { FoodSuggestionService } from './food.suggestion.service'

import 'rxjs/add/operator/map';

@Component({
    selector: 'food',
    templateUrl: 'food.component.html',
})
export class FoodComponent implements OnInit {
    constructor(private foodSuggestionService: FoodSuggestionService) {
      console.log('food component constr');
    }

    ngOnInit() {
      console.log('food component ngoninit');
    }

    foodSearchQuery: string;

    foodSearchResults: string[];

    foodSearch(event) {
        this.foodSuggestionService.getNDBFoodSuggestion(event.query).subscribe(
          res => {
            this.foodSearchResults = res;
          }
        )
    }

}
