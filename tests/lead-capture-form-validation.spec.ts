import { test, expect } from '../base/pomFixture';

const validEmail = process.env.TEST_EMAIL_VALID!;
const invalidEmail = process.env.TEST_EMAIL_INVALID!;

// Testing the e-mail subsciption form on the Home Page

test.describe('Lead Capture Form', () => {

  test.beforeEach(async ({ homePage }) => {
    await test.step('Open the home page and ensure that the Lead Capture Form is present and complete', async () =>{
      await homePage.goto();
      expect(homePage.newsletterForm).toBeVisible;
      expect(homePage.newsletterEmailInput).toBeVisible;
      expect(homePage.newsletterSubmitButton).toBeVisible;
    });
  });


  test('should submit the Lead Capture Form with valid email', async ({ homePage, thanksForSigningUpPage }) => {    
    await test.step('Fill in the e-mail input field with a valid e-mail address, submit the Lead Capture Form and ensure that the feedback message shows up', async () =>{
        await homePage.submitNewsletter(validEmail);
        await expect(thanksForSigningUpPage.title).toBeVisible();
    });
  });

  
  // This test will fail due to the non existing invalid e-mail notification message
  test('should show error on invalid email', async ({ homePage, thanksForSigningUpPage }) => {
    await test.step('Fill in the e-mail input field with an invalid e-mail address, try to submit the Lead Capture Form and ensure that invalid e-mail address notification shows up', async () =>{
      await homePage.submitNewsletter(invalidEmail);      
      await expect(homePage.invalidEmailNotification).toBeVisible();
      await expect(thanksForSigningUpPage.title).not.toBeVisible();
    });
  });

});