export class PartialLinkList {
  constructor(
    public titles: string[],
    public plcontinue: string) {
  }

  public get isLast(): boolean {
    return this.plcontinue === null;
  }
}
