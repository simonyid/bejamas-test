import { Page, Locator } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// General, non page-related methods class

class GeneralUtils {

    // The different non-http(s) protocols should be skipped
    readonly protocolsToSkip = [
        'file:',
        'mailto:',
        'tel:',
        'sms:',
        'ftp:',            
        'geo:',
        'irc:',
        'data:',
        'about:',
        'whatsapp:',
        'skype:'
      ];

    constructor(private page: Page) {
        this.page = page;
    }

    // Helper method for saving an array to a CSV file
    async saveArrayToCsv (input: any[], filename: string): Promise<void>{
        const filePath = `./resources/${filename}`;
        
        const is2D = Array.isArray(input[0]); // cheking if the array is 2D
        
        const csv = input.map(row => {
            const values = is2D ? row : [row];
            return values.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',');
        }).join('\n');

        fs.writeFileSync(filePath, csv, 'utf8');
    }

    // Helper function to read single column csv file into a string array
    async readSingleColumnCSV(fileName: string): Promise<string[]> {
        const content = fs.readFileSync(`./resources/${fileName}`, 'utf8');
        return content
          .split('\n')              // Split by lines
          .map(line => line.trim().replace(/^"|"$/g, ''))
          .filter(line => line !== ''); // Remove empty lines
      }

    // Helper method for getting the domain from a path
    getDomainFromUrl(path: string): string {
        try {
          const url = new URL(path);
          return `${url.protocol}//${url.host}`;
        } catch (error) {
          console.error('Invalid URL:', path);
          return '';
        }
      }

    // Helper method for getting all the links from a webpage. It will give back the resultset in an array
    async getAllLinksFromTheUrl (url: string) {        
        await this.page.goto(url);
        // Get all href attributes from anchor tags
        const links: string[] = await this.page.$$eval('a[href]', (anchors) =>
            anchors.map((a) => a.getAttribute('href') || '') // Extract the href attribute or an empty string if null
          );                
        return links;
    }

    // Helper method for checking a link's availability. It needs the link's parent page url to be able to test the relative links too
    async testLinkAvailability (link: string, parentUrl: string): Promise<number> {                        
                
        // We will automatically return status 200 if the link is related one of the non-http(s) protocols
        if(this.protocolsToSkip.some(protocol => link.startsWith(protocol))){
            return 200;
        }
         
        // If the link starts with / or # (it is a relative link), the parent url is being added to its beginning
        if (link.startsWith('/') || link.startsWith('#')) {
            link=parentUrl+link;
        }
        
        // If the fetch succeeds, we return the real status
        try {
                var response = await fetch(link, {
                    headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            return response.status;
        }
        // Otherwise a 404 status
        catch {
            return 404;
        }
        
    }

    // Helper method to test the links availability on a specific URL
    async testLinksAvailabilityOnUrl (url: string){        
        const links = await this.getAllLinksFromTheUrl(url);
        // Check the links status
        var output = true;
        for (const link of links) {
            var linkStatus = await this.testLinkAvailability(link, url);
            if(linkStatus==404){
                output = false;
                console.warn(`⚠️ ${link}: ${linkStatus}`);
            }
        }
        return output;
    }

        // Helper method to test the links availability in a specific csv file
        async testLinksAvailabilityInCsv (fileName: string){        
            const links = await this.readSingleColumnCSV(fileName);
            // Check the links status
            var output = true;
            for (const link of links) {
                var linkStatus = await this.testLinkAvailability(link, this.getDomainFromUrl(link));
                if(linkStatus==404){
                    output = false;
                    console.warn(`⚠️ ${link}: ${linkStatus}`);
                }
            }
            return output;
        }

    // Helper method to move the mouse pointer onto an element's center and click 
    async moveMouseToElementAndClick (element: Locator){
        const box = await element.boundingBox();
        if (box) {
        await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        }
    }

    // Helper method for converting relative links to absolute
    convertToAbsoluteLink (link: string, rootUrl: string, currentUrl: string): string {
        // If the link is already an absolute link or a known protocol link
        if (/^(https?:)?\/\//.test(link) || this.protocolsToSkip.some(protocol => link.startsWith(protocol))) {
            return link; // Leave the link as is
          }

        // If the link should be root-relative (starts with /)
        if (link.startsWith('/')) {
            return new URL(link, rootUrl).href; //combine it with the root URL
          }
        
        // For other relative paths
        return new URL(link, currentUrl).href;
    }

    // Helper method for crawling all links from the pages of the website located on the given URL
    // crawlDepth defines how deep the crawling should go. 1 means that it will crawl all the links from the starting page and all links from the pages crawled from the starting page
    async crawlTheLinksFromTheWebsite (websiteURL: string, crawlDepth: number): Promise<string[][]>{
        var previousLinksCount = 0;
        var currentLinksCount = 1;
        var links: string[][] = [];
        links.push([websiteURL,websiteURL]);
        var counter = 0;
        while (counter <= crawlDepth){ //crawling until we reach the given depth
            for (var n=previousLinksCount; n<currentLinksCount; n++){ // The loop always goes trough the newly crawled links - between the previous end and the current end of the list
                if(links[n][0].startsWith(websiteURL)) { // Crawling only the given website's links
                    var list = await this.getAllLinksFromTheUrl(links[n][0]); // Gathering all links from the current url
                    const currentRealUrl = this.page.url(); // Getting the real current url, because potential redirects can change it
                    for (const listElement of list) {
                        // Converting the link from the recently crawled list to an absolute link (eg. '/someting' to 'domain-url/something', 'something' to 'domain-url/current-page/something')
                        // and adding it to the links array
                        links.push([this.convertToAbsoluteLink(listElement,this.getDomainFromUrl(currentRealUrl),currentRealUrl),links[n][0]]);
                    }
                }
            }
            previousLinksCount = currentLinksCount;
            currentLinksCount = links.length;
            counter++;
        }        
        return links;
    }

    // Helper method to crawl and save the links from the pages of the website located on the given URL
    // crawlDepth defines how deep the crawling should go. 1 means that it will crawl all the links from the starting page and all links from the pages crawled from the starting page
    async crawlTheLinksFromTheWebsiteToCsv (websiteURL: string, crawlDepth: number, outputFileName: string) {
        const links = await this.crawlTheLinksFromTheWebsite(websiteURL,crawlDepth);
        const simpleLinks: string[] = [...new Set(links.map(row => row[0]))]; //creating a one dimensional array from the urls with removing the duplicates
        var outputFileNameWithParentUrls = '';
        const lastIndex = outputFileName.lastIndexOf('.');
        if (lastIndex === -1) {
            outputFileNameWithParentUrls+="_withParentUrls";
        } else {
            outputFileNameWithParentUrls = outputFileName.substring(0, lastIndex) + "_withParentUrls." + outputFileName.substring(lastIndex + 1);
        }
        
        this.saveArrayToCsv(links as any[], outputFileNameWithParentUrls); // Saving the whole array to a csv file
        this.saveArrayToCsv(simpleLinks as any[], outputFileName); // Saving the first column of the whole array to a csv file
    }

}
export default GeneralUtils;