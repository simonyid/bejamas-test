import { Page, Locator } from '@playwright/test';

class ThanksForSigningUpPage {    
    readonly title: Locator;    
    
    readonly pageUrl = process.env.HOME_URL!+'/thanks-for-signing-up/';

    constructor(private page: Page) {
        this.page = page;    
        this.title = page.locator(`//h1[contains(text(),"Thank you for signing up!")]`); // Adjust based on actual message        
      }
    
      async goto() {
        await this.page.goto(this.pageUrl);
      }

}
export default ThanksForSigningUpPage;