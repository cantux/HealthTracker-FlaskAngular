/**
 * Created by cant on 12/6/16.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OverlayPanelModule } from 'primeng/components/overlaypanel/overlaypanel';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';

import { AccessComponent } from './access.component';
import { LoginComponent } from './login'
import { RegisterComponent } from './register'

@NgModule({
  imports: [
    OverlayPanelModule,
    FormsModule,
    InputTextModule
  ],
  exports: [ AccessComponent ],
  declarations: [
    AccessComponent,
    LoginComponent,
    RegisterComponent
  ],
  bootstrap: [ AccessComponent ]
})
export class AccessModule {
  constructor () {
    console.log('access overlay module constr');
  }
}
