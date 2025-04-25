import { test, expect } from '../base/pomFixture';

const homeUrl = process.env.HOME_URL!;

test.describe('Broken links tests', () => {

    test('There should be no 404 links on homepage', async ({ generalUtils }) => {
        test.setTimeout(180_000); // Extending the time out to be able to check all the links on the page
        expect(await generalUtils.testLinksAvailabilityOnUrl(homeUrl)).toBe(true);
    });
    
});