import { TravelAppFrontendPage } from './app.po';

describe('travel-app-frontend App', function() {
  let page: TravelAppFrontendPage;

  beforeEach(() => {
    page = new TravelAppFrontendPage();
  });

  it('should display the home page text', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
