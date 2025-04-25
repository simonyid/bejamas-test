import { Page, Locator } from '@playwright/test';

// Home page
class HomePage {
  readonly newsletterForm: Locator;
  readonly newsletterEmailInput: Locator;
  readonly newsletterSubmitButton: Locator;
  readonly feedbackMessage: Locator;
  readonly invalidEmailNotification: Locator;

  readonly pageUrl = process.env.HOME_URL!;

  constructor(private page: Page) {
    this.page = page;
    this.newsletterForm = page.locator(`//section[h2[contains(text(), 'Stay up to date with Netlify news')]]//form`);
    this.newsletterEmailInput = page.locator(`//input[@name="email"]`);
    this.newsletterSubmitButton = page.locator(`//input[@value='Subscribe']`);
    this.feedbackMessage = page.locator(`//h1[contains(text(),"Thank you for signing up!")]`); // Adjust based on actual message
    this.invalidEmailNotification = page.locator('text=Please enter a valid email');
  }

  async goto() {
    await this.page.goto(this.pageUrl);
  }

  async login() {
    await this.page.goto(this.pageUrl);

  }

  async submitNewsletter(email: string) {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(1000); // wait 1 second for content to load
    await this.newsletterEmailInput.fill(email);
    await this.newsletterSubmitButton.click();    
  }

  async getFeedbackText() {
    return this.feedbackMessage.textContent();
  }
  
}
export default HomePage;