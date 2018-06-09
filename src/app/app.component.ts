import {Component, Input} from '@angular/core';
import {WikipediaApiService} from "./wikipedia/api/wikipedia-api.service";
import {PartialLinkList} from "./wikipedia/api/partial-link-list";
import {PageInfo} from "./wikipedia/api/page-info";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Input()
  public title: string
  public extract: string;

  public linkedTitles: string[];

  constructor(private wikipediaApiService: WikipediaApiService) {
    this.linkedTitles = [];
    this.extract = '';
  }

  onSearchClicked() {
    this.linkedTitles = [];
    this.extract = '';
    this.wikipediaApiService.loadPageInfo(this.title)
      .subscribe(this.onInfoLoaded);
  }

  private onInfoLoaded = (pageInfo: PageInfo) => {
    console.log(pageInfo)

    if(!pageInfo) {
      console.error('no page found');
      return;
    }
    this.extract = pageInfo.extract;

    this.wikipediaApiService.loadFirstLinkedTitles(pageInfo.title)
      .subscribe(this.onLinksLoaded)
  };

  private onLinksLoaded = (linkList: PartialLinkList) => {
    this.linkedTitles = this.linkedTitles.concat(linkList.linkedTitles);
    if(!linkList.isLast) {
      this.wikipediaApiService.loadNextLinkedTitles(linkList)
        .subscribe(this.onLinksLoaded);
    }
  }
}
