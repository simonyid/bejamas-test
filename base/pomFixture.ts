import {test as baseTest} from '@playwright/test';
import HomePage from '../pages/home-page';
import ThanksForSigningUpPage from '../pages/thanks-for-signing-up-page';
import GeneralUtils from '../utils/general-utils';

type pages = {
    homePage: HomePage;
    generalUtils: GeneralUtils;
    thanksForSigningUpPage: ThanksForSigningUpPage;
}

const testPages = baseTest.extend<pages>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
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