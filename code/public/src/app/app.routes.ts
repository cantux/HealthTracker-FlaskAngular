import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';

import { UserComponent } from './user';
import { UserResolver } from './user/user.resolver.service'
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'detail', loadChildren: () => System.import('./+detail')
      .then((comp: any) => comp.default),
  },
  { path: 'user/:id',
    component: UserComponent,
    resolve: {
      userDetail: UserResolver
    }
  },
  { path: '**',    component: NoContentComponent },
];
