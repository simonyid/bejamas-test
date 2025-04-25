import {test as baseTest} from '@playwright/test';
import HomePage from '../pages/home-page';
import LoginEmailPage from '../pages/login-email-page';
import ThanksForSigningUpPage from '../pages/thanks-for-signing-up-page';
import GeneralUtils from '../utils/general-utils';

// Extending the @playwright/tests with the pages to make their declaration easier in the tests
type pages = {
    homePage: HomePage;
    generalUtils: GeneralUtils;
    thanksForSigningUpPage: ThanksForSigningUpPage;
    loginEmailPage: LoginEmailPage;
}

const testPages = baseTest.extend<pages>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    
    loginEmailPage: async ({ page }, use) => {
        await use(new LoginEmailPage(page));
    },

    generalUtils: async ({ page }, use) => {
        await use(new GeneralUtils(page));
    },

    thanksForSigningUpPage: async ({ page }, use) => {
        await use(new ThanksForSigningUpPage(page));
    }

});
export const test = testPages;
export const expect = baseTest.expect;