import { Page, Locator } from '@playwright/test';

// Login E-mail page

class LoginEmailPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  readonly pageUrl = process.env.HOME_URL!+'/login';

  constructor(private page: Page) {
    this.page = page;
    this.emailInput = page.locator(`//input[contains(@autocorrect,'off')]`);
    this.passwordInput = page.locator(`//input[@id='password']`);
    this.loginButton = page.locator(`//button[@type='submit']`);
  }

  async goto() {
    await this.page.goto(this.pageUrl);
  }

  async login() {
    await this.page.goto(this.pageUrl);
    await this.page.waitForTimeout(1000); // wait 1 second for content to load
    await this.emailInput.fill(process.env.USER_EMAIL!);
    await this.passwordInput.fill(process.env.USER_PASSWORD!);
    await this.loginButton.click();
  }

}
export default LoginEmailPage;