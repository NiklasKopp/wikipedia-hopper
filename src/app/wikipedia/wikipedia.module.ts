import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {WikipediaApiService} from "./api/wikipedia-api.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    WikipediaApiService
  ]
})
export class WikipediaModule { }
