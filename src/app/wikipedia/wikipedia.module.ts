import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {WikipediaApiService} from "./api/wikipedia-api.service";
import {HttpClientModule} from "@angular/common/http";
import {GraphComponent} from "./graph/graph.component";
import {WikipediaGraphService} from "./graph/wikipedia-graph.service";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    WikipediaApiService,
    WikipediaGraphService
  ],
  declarations: [
    GraphComponent
  ],
  exports: [
    GraphComponent
  ]
})
export class WikipediaModule { }
