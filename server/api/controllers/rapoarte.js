const puppeteer = require('puppeteer');
const fs = require("fs");   
let ejs = require('ejs'),
    people = ['geddy', 'neil', 'alex'],
    html = ejs.render('<%= people.join(", "); %>', {people: people});
module.exports.documente_interval = (req,res,next) => {
    console.log('sunt in controllerul rapoarte actiunea documente_interval',req.body);

    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.emulateMedia('screen');
        await page.setContent(html);
        await page.pdf({path: `${__dirname}/hn.pdf`, format: 'A4', printBackground:true});
        
        await browser.close();
        var file = fs.createReadStream(`${__dirname}/hn.pdf`);
        file.pipe(res);
      })();

  
}