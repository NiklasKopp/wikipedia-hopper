export class WikipediaLink {
  public readonly id: string;

  constructor(public readonly from: string, public readonly to: string) {
    this.id = this.from + '->' + this.to;
  }
}
