import { WikipediaModule } from './wikipedia.module';

describe('WikipediaModule', () => {
  let wikipediaModule: WikipediaModule;

  beforeEach(() => {
    wikipediaModule = new WikipediaModule();
  });

  it('should create an instance', () => {
    expect(wikipediaModule).toBeTruthy();
  });
});
