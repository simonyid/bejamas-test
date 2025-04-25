import { Page, Locator } from '@playwright/test';

class GeneralUtils {
    constructor(private page: Page) {
        this.page = page;
    }

    async getAllLinksFromThePage(url: string) {        
        await this.page.goto(url);
        // Get all href attributes from anchor tags
        const links: string[] = await this.page.$$eval('a[href]', (anchors) =>
            anchors.map((a) => a.getAttribute('href') || '') // Extract the href attribute or an empty string if null
          );                
        return links;
    }

    async testLink(link: string, parentUrl: string): Promise<number>{                        
        // The different non-http(s) protocols will be skipped
        const protocolsToSkip = [
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
        
        // We will automatically return status 200 if the link is related one of the non-http(s) protocols
        if(protocolsToSkip.some(protocol => link.startsWith(protocol))){
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

    async testLinksAvailabilityOnUrl(url: string){        
        const links = await this.getAllLinksFromThePage(url);
        // Check the links status
        var output = true;
        for (const link of links) {
            var linkStatus = await this.testLink(link, url)
            if(linkStatus==404){
                output = false;
                console.warn(`⚠️ ${link}: ${linkStatus}`);
            }
        }
        return output;
    }

    async moveMouseToElementAndClick(element: Locator){
        const box = await element.boundingBox();
        if (box) {
        await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        }
    }

}
export default GeneralUtils;