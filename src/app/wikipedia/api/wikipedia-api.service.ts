import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {WIKIPEDIA_URL} from "../config";
import {PageInfo} from "./page-info";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {PartialLinkList} from "./partial-link-list";

const EXTRACT_SIZE: number = 250;

@Injectable()
export class WikipediaApiService {

  constructor(
     @Inject(WIKIPEDIA_URL) private wikiUrl: string,
     private http: HttpClient){
  }


  public loadPageInfo(pageTitle: string): Observable<PageInfo> {
    pageTitle = this.prepareTitleForSearch(pageTitle);

    return this.http.get(this.apiUrl, {params: this.createInfoParameters(pageTitle)})
      .pipe(map(this.toPageInfo));
  }

  private prepareTitleForSearch(title: string): string {
    return title.split(' ')
      .map(str => str.substring(0, 1).toUpperCase() + str.substring(1))
      .join(' ');
  }

  public loadFirstLinkedTitles(pageTitle: string): Observable<PartialLinkList> {
    console.log('loading links for page ' + pageTitle);

    return this.http.get(this.apiUrl, {params: this.createLinkParameters(pageTitle)})
      .pipe(map(this.createLinkList));
  }

  public loadNextLinkedTitles(previousList: PartialLinkList = null): Observable<PartialLinkList> {
    if(previousList.isLast) {
      return Observable.create(new PartialLinkList(previousList.sourcePageTitle,[], null));
    }
    console.log('loading more for page ' + previousList.sourcePageTitle);

    return this.http.get(this.apiUrl, {
      params: this.createLinkParameters(previousList.sourcePageTitle)
        .append('plcontinue', previousList.plcontinue)})
        .pipe(map(this.createLinkList));
  }

  private createLinkList = (linkResponse: any): PartialLinkList => {
    for(let pageId in linkResponse.query.pages) {
      const page: any = linkResponse.query.pages[pageId];

      if(page.missing === '') {
        continue;
      }

      const links: string[] = page.links
        .filter(info => info.ns === 0)
        .map(info => info.title);

      if(linkResponse.continue && linkResponse.continue.plcontinue) {
        return new PartialLinkList(page.title, links, linkResponse.continue.plcontinue);
      }else {
        return new PartialLinkList(page.title, links, null);
      }
    }
    return new PartialLinkList('',[], null);
  };

  private toPageInfo = (response: any): PageInfo => {
    for(let pageId in response.query.pages) {
      const page: any = response.query.pages[pageId];
      return new PageInfo(page.title, page.fullurl, page.extract);
    }
    return null;
  };

  private createBaseParameters(pageTitle: string): HttpParams {
    return new HttpParams({
      fromObject: {
        action: 'query',
        origin: '*',
        format: 'json',
        redirects: 'true',
        titles: pageTitle
      }
    });
  }

  private createInfoParameters(pageTitle: string) : HttpParams {
    return this.createBaseParameters(pageTitle)
      .append('inprop', 'url')
      .append('prop', 'info|extracts')
      .append('exlimit', '1')
      .append('exchars', String(EXTRACT_SIZE))
      .append('explaintext', 'true');
  }

  private createLinkParameters(pageTitle: string) {
    return this.createBaseParameters(pageTitle)
      .append('prop', 'links')
      .append('pltitles', '')
      .append('pllimit', 'max');
  }

  private get apiUrl(): string  {
    return this.wikiUrl + '/w/api.php';
  }
}
