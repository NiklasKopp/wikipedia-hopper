import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {WIKIPEDIA_URL} from "../config";
import {PageInfo} from "./page-info";
import {Observable, pipe} from "rxjs";
import {map} from 'rxjs/operators';

const BASE_QUERY = "action=query&titles=%s&format=json&redirects";
const LINK_QUERY_PARAMS = BASE_QUERY + "&prop=links&pltitles&pllimit=max";
const INFO_QUERY_PARAMS = BASE_QUERY
  + "&prop=info|extracts&exchars=250&explaintext&inprop=url";
const BACK_LINK_QUERY_PARAMS = "action=query&format=json&list=backlinks&bltitle=%s&bllimit=max";

const EXTRACT_SIZE: number = 250;

@Injectable()
export class WikipediaApiService {
  private titleToRealTitle: Map<string, string>;

  constructor(
     @Inject(WIKIPEDIA_URL) private wikiUrl: string,
     private http: HttpClient){

    this.titleToRealTitle = new Map<string, string>();

    // let params = this.createInfoParameters('Gulasch');
    // console.log(this.apiUrl + '?' + params.toString())

    // this.getPageInfo('Gulasch').subscribe(console.log);
  }

  public getPageInfo(pageTitle: string): Observable<PageInfo> {
    return this.http.get(this.apiUrl, {params: this.createInfoParameters(pageTitle)})
      .pipe(map(this.toPageInfo));
  }

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

  private get apiUrl(): string  {
    return this.wikiUrl + '/w/api.php';
  }
}
