export class WikipediaPage {
  public id: string;
  public label: string;

  constructor(public readonly title: string){
    this.id = title;
    this.label = title;
  }
}
