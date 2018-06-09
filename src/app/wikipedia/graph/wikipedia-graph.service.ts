import {Injectable} from "@angular/core";
import {WikipediaApiService} from "../api/wikipedia-api.service";
import {PageInfo} from "../api/page-info";
import {PartialLinkList} from "../api/partial-link-list";
import {DataSet} from "vis";
import {WikipediaPage} from "./wikipedia-page";
import {WikipediaLink} from "./wikipedia-link";
@Injectable()
export class WikipediaGraphService {
  public readonly nodes: DataSet<WikipediaPage>;
  public readonly edges: DataSet<WikipediaLink>;

  constructor(private apiService: WikipediaApiService) {
    this.nodes = new DataSet<WikipediaPage>();
    this.edges = new DataSet<WikipediaLink>();
  }

  public addPage(pageTitle: string) {
    this.apiService.loadPageInfo(pageTitle)
      .subscribe(this.onInfoLoaded);
  }

  public addLinksFor(pageTitle: string) {
    this.apiService.loadFirstLinkedTitles(pageTitle)
      .subscribe(this.onLinksLoaded);
  }

  private onInfoLoaded = (pageInfo: PageInfo) => {
    console.log(pageInfo)

    if(!pageInfo) {
      console.error('no page found');
      return;
    }

    this.nodes.add(new WikipediaPage(pageInfo.title));
  };

  private onLinksLoaded = (linkList: PartialLinkList) => {

    linkList.linkedTitles.forEach(linkTo => {
      this.nodes.add(new WikipediaPage(linkTo));
      console.log('added node')
      this.edges.add(new WikipediaLink(linkList.sourcePageTitle, linkTo));
    });

    if(!linkList.isLast) {
      this.apiService.loadNextLinkedTitles(linkList)
        .subscribe(this.onLinksLoaded);
    }
  }
}
