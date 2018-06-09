import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {WIKIPEDIA_URL} from "../config";

@Injectable()
export class WikipediaApiService {
  constructor(
     @Inject(WIKIPEDIA_URL) private wikiUrl: string,
     private http: HttpClient){
  }
}
