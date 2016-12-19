import { Component, ViewEncapsulation } from '@angular/core';

import { AppState } from './app.service';

import * as primengCSS from 'primeng/resources/primeng.css';
import * as primeUITheme from 'primeui/themes/bootstrap/theme.css'
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css',
    primengCSS,
    primeUITheme
  ],
  template: `
    <nav>
      <span>
        <a [routerLink]=" ['./'] ">
          Index
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./home'] ">
          Health Tracker Home
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./detail'] ">
          Async Module Detail
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./about'] ">
          About Us
        </a>
      </span>
      <access></access>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>
    <pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>

    <footer>
      <span>WebPack Angular 2 Starter by <a [href]="url">@AngularClass</a></span>
    </footer>
  `
})
export class AppComponent {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  constructor(
    public appState: AppState) {

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
