/**
 * Created by cant on 12/6/16.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OverlayPanelModule } from 'primeng/components/overlaypanel/overlaypanel';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { ButtonModule } from 'primeng/components/button/button';

import { AccessComponent } from './access.component';
import { LoginComponent } from './login'
import { RegisterComponent } from './register'
import { ProfileComponent } from './profile'
import { LogoutComponent } from './logout'
// import { ProfileService } from './profile/profile.service'

import { UserModule } from '../user'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    OverlayPanelModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    UserModule
  ],
  exports: [ AccessComponent ],
  declarations: [
    AccessComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    LogoutComponent
  ],
  bootstrap: [ AccessComponent ],
  providers: [ /* ProfileService */]
})
export class AccessModule {
  constructor () {
    console.log('access overlay module constr');
  }
}
