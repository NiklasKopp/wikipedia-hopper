import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {WikipediaModule} from "./wikipedia/wikipedia.module";
import {WIKIPEDIA_URL} from "./wikipedia/config";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
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
