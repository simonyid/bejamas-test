import { test, expect } from '../base/pomFixture';

const homeUrl = process.env.HOME_URL!;

// Testing the broken links on the website

test.describe('Broken links tests', () => {

     //This test can be skipped if we already have the csv with the urls from the website
     //Otherwise, it will regenerate the two csv files with the links
     //The files are in the resources folder
    test('Crawling the links from the website', async ({ generalUtils }) => {
        test.setTimeout(1180_000); // Extending the timeout to be able to check all the links on the page
        //await generalUtils.crawlTheLinksFromTheWebsite(homeUrl,1);
        await generalUtils.crawlTheLinksFromTheWebsiteToCsv(homeUrl, 1, 'links.csv');
    });

    test('There should be no 404 links on homepage', async ({ generalUtils }) => {
        test.setTimeout(180_000); // Extending the timeout to be able to check all the links on the page
        expect(await generalUtils.testLinksAvailabilityOnUrl(homeUrl)).toBe(true);
    });

    //Opening a list of links from a csv file and testing them agains availability
    //At the moment, it is a list of links crawled with the firs test script of the current test scenario
    test('There should be no 404 links in the list of links', async ({ generalUtils }) => {
        test.setTimeout(3360_000); // Extending the timeout to be able to check all the links in the csv
        expect(await generalUtils.testLinksAvailabilityInCsv('links.csv')).toBe(true);
    });
    
});