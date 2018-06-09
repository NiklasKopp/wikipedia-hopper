import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {WIKIPEDIA_URL} from "../config";
import {PageInfo} from "./page-info";
import {Observable} from "rxjs";
import {concat, concatAll, flatMap, map} from 'rxjs/operators';
import {PartialLinkList} from "./partial-link-list";

const BASE_QUERY = "action=query&titles=%s&format=json&redirects";
const LINK_QUERY_PARAMS = BASE_QUERY + "&prop=links&pltitles&pllimit=max";
const INFO_QUERY_PARAMS = BASE_QUERY
  + "&prop=info|extracts&exchars=250&explaintext&inprop=url";
const BACK_LINK_QUERY_PARAMS = "action=query&format=json&list=backlinks&bltitle=%s&bllimit=max";

const EXTRACT_SIZE: number = 250;

@Injectable()
export class WikipediaApiService {

  constructor(
     @Inject(WIKIPEDIA_URL) private wikiUrl: string,
     private http: HttpClient){
  }

  public loadPageInfo(pageTitle: string): Observable<PageInfo> {
    return this.http.get(this.apiUrl, {params: this.createInfoParameters(pageTitle)})
      .pipe(map(this.toPageInfo));
  }

  public loadFirstLinkedTitles(pageTitle: string): Observable<PartialLinkList> {
    return this.http.get(this.apiUrl, {params: this.createLinkParameters(pageTitle)})
      .pipe(map(this.createLinkList));
  }

  public loadNextLinkedTitles(pageTitle: string, previousList: PartialLinkList): Observable<PartialLinkList> {
    if(previousList.isLast) {
      return Observable.create(new PartialLinkList([], null));
    }
    return this.http.get(this.apiUrl, {
      params: this.createLinkParameters(pageTitle)
        .append('plcontinue', previousList.plcontinue)})
        .pipe(map(this.createLinkList));
  }

  private createLinkList = (linkResponse: any): PartialLinkList => {
    for(let pageId in linkResponse.query.pages) {
      const page: any = linkResponse.query.pages[pageId];

      const links: string[] = page.links
        .filter(info => info.ns === 0)
        .map(info => info.title);

      if(linkResponse.continue && linkResponse.continue.plcontinue) {
        return new PartialLinkList(links, linkResponse.continue.plcontinue);
      }else {
        return new PartialLinkList(links, null);
      }
    }
    return new PartialLinkList([], null);
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
        redirects: '',
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
      .append('explaintext', '');
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
