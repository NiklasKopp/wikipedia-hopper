import { Component } from '@angular/core';
import {WikipediaApiService} from "./wikipedia/api/wikipedia-api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private wikipediaApiService: WikipediaApiService) {

  }
}
