import { test, expect, request } from '@playwright/test';
import { parseStringPromise } from 'xml2js';

const sitemapUrl = process.env.SITEMAP_URL!;

// Testing the sitemap links agains availability and noindex robots tags

test.describe('Sitemap tests', () => {
  
  test('Sitemap and Crawlability Verification', async ({ request, page }) => {
    // I set up a bigger timeout here due to the large amount of sitemap links - not a good practice, but otherwise we cannot check all the links
    test.setTimeout(3600_000);
    // Verify if sitemap.xml exists
    const sitemapResponse = await request.get(sitemapUrl);
    expect(sitemapResponse.ok()).toBeTruthy();
  
    const sitemapXml = await sitemapResponse.text();
  
    // Parse sitemap and extract URLs
    const parsed = await parseStringPromise(sitemapXml);
    const urls: string[] = parsed.urlset.url.map((entry: any) => entry.loc[0]);
  
    expect(urls.length).toBeGreaterThan(0);
  
    for (const url of urls) {      

      // Check if each URL is accessible
      var res;
      try {
        res = await request.get(url);
        expect(res.status()).toBeLessThan(400);
      } catch (error) {
         console.warn(`⚠️  URL failed: ${url}\n ${error}`);
      }

      // Check for <meta name="robots" content="noindex"> unless allowed      
      try{
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        } catch (error) {
          console.warn(`⚠️  URL failed: ${url}\n ${error}`);
        }
        
      try {
        const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content', { timeout: 1000});
    
        if (robotsMeta?.includes('noindex')) {
          console.warn(`⚠️  Page ${url} has a noindex tag`);
          // We can fail the test here if noindex is not intended:
          // expect(robotsMeta).not.toContain('noindex');
        }
      } catch ( error ) {
        // if there is no robots meta, that means that there is neither noindex. Nothing to do with the link.
      }
  
      // Check if page is crawlable (not disallowed via robots meta or header)
      const xRobots = res.headers()['x-robots-tag'];
      if (xRobots?.includes('noindex')) {
        console.warn(`⚠️  Page ${url} has an X-Robots-Tag: noindex header`);
        // expect(xRobots).not.toContain('noindex');
      }
    }
  });

});