/**
 * Created by cant on 12/7/16.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DataListModule } from 'primeng/components/datalist/datalist';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { ButtonModule } from 'primeng/components/button/button';
import { ChartModule } from 'primeng/components/chart/chart';

import { USER_RESOLVER_PROVIDERS } from './user.resolver.service';
import { UserDetailService } from './user.detail.service';
import { UserComponent } from './user.component'

import { FoodComponent } from './food'

import { FoodSuggestionService } from './food/food.suggestion.service'
import { FoodProviderService } from './food/food.provider.service'
import { ConsumptionService  } from './food/consumption.service'

import { ActivityComponent } from './activity'
import { ActivityService } from './activity/activity.service'

import { WeightComponent } from './weight'
import { WeightService } from './weight/weight.service'
import { BmiComponent } from './weight/bmi'
import { ReportComponent } from './weight/report'

import { ICGraphComponent } from './ic.graph'


const USER_PROVIDERS = [
  ...USER_RESOLVER_PROVIDERS,
  UserDetailService,
  WeightService,
  FoodSuggestionService,
  FoodProviderService,
  ConsumptionService,
  ActivityService
];

@NgModule({
  imports: [
    FormsModule,
    DataListModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
    ButtonModule,
    ChartModule
  ],
  exports: [ UserComponent ],
  declarations: [
    UserComponent,
    WeightComponent,
    FoodComponent,
    ActivityComponent,
    BmiComponent,
    ReportComponent,
    ICGraphComponent
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
