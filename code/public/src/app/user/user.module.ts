/**
 * Created by cant on 12/7/16.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DataListModule } from 'primeng/components/datalist/datalist';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';

import { USER_RESOLVER_PROVIDERS } from './user.resolver.service';
import { UserDetailService } from './user.detail.service';
import { UserComponent } from './user.component'

import { WeightComponent } from './weight'
import { WeightService } from './weight/weight.service'

import { FoodComponent } from './food'
import { FoodSuggestionService } from './food/food.suggestion.service'
import { FoodProviderService } from './food/food.provider.service'

const USER_PROVIDERS = [
  ...USER_RESOLVER_PROVIDERS,
  UserDetailService,
  WeightService,
  FoodSuggestionService,
  FoodProviderService
];

@NgModule({
  imports: [
    FormsModule,
    DataListModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule
  ],
  exports: [
    UserComponent ],
  declarations: [
    UserComponent,
    WeightComponent,
    FoodComponent
  ],
  bootstrap: [
    UserComponent ],
  providers: [
    USER_PROVIDERS
  ]
})
export class UserModule {
  constructor () {
    console.log('access overlay module constr');
  }
}
