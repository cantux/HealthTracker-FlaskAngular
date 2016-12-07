/**
 * Created by cant on 12/6/16.
 */
import { NgModule } from '@angular/core';

import { AccessComponent } from './access.component';
import { LoginComponent } from './login'

import { OverlayPanelModule } from 'primeng/components/overlaypanel/overlaypanel';

@NgModule({
  imports: [ OverlayPanelModule ],
  exports: [ AccessComponent ],
  declarations: [ AccessComponent, LoginComponent ],
  bootstrap: [ AccessComponent ]
})
export class AccessModule {
  constructor () {
    console.log('access overlay module constr');
  }
}
