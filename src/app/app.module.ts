import {NgModule, Injectable, NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';

@Injectable()
export class Service {}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
      Service
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
