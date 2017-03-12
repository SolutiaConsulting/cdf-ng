import { CdfNgPage } from './app.po';

describe('cdf-ng App', () => {
  let page: CdfNgPage;

  beforeEach(() => {
    page = new CdfNgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
