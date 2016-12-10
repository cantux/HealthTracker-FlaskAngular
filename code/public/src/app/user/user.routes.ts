/**
 * Created by cant on 12/10/16.
 */
import { Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { UserResolver } from './user.resolver.service'

export const USER_ROUTES: Routes = [
  { path: 'user/:id',
    component: UserComponent,
    resolve: {
      userDetail: UserResolver
    }
  }
];
