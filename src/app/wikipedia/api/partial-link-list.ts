export class PartialLinkList {
  constructor(
    public sourcePageTitle: string,
    public linkedTitles: string[],
    public plcontinue: string) {
  }

  public get isLast(): boolean {
    return this.plcontinue === null;
  }
}
