import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {WikipediaModule} from "./wikipedia/wikipedia.module";
import {WIKIPEDIA_URL} from "./wikipedia/config";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WikipediaModule
  ],
  providers: [
    {
      provide: WIKIPEDIA_URL,
      useValue: 'https://de.wikipedia.org'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
