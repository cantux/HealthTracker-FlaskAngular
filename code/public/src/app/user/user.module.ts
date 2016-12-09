/**
 * Created by cant on 12/7/16.
 */
import { NgModule } from '@angular/core';

import { UserResolver } from './user.resolver.service'

@NgModule({
  imports: [

  ],
  exports: [  ],
  declarations: [

  ],
  bootstrap: [ ],
  providers: []
})
export class UserModule {
  constructor () {
    console.log('access overlay module constr');
  }
}
