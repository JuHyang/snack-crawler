const puppeteer = require ('puppeteer')
const cheerio = require ('cheerio')

var url = "http://www.gmarket.co.kr/"


function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

exports.crawlerGmarket = function (snackName, resolve) {
  ( async () => {
    var result = new Object()
    result['site'] = "G 마켓"
    const browser = await puppeteer.launch({headless : true, args : ['--no-sandbox, --disable-setuid-sandbox']})
    const page = await browser.newPage({ context: 'another-context' })
    await page.goto(url)
    await page.waitForSelector('#keyword')
    await page.click("[id=keyword]")
    await page.type("[id=keyword]", snackName)
    await page.click("#search > button")
    await page.waitForSelector('#footer > div > div.address > div.cscenter > a')
    var html = await page.content()
    var $ = cheerio.load(html);
    result['link'] = page.url()
    var data = new Array()
    $('div > div > div > ul > li').each(function (index, ele) {
      if ($(this).find('div > a > .title').text().trim() != "") {
        var temp = Object()
        temp['name'] = $(this).find('div > a > .title').text().trim()
        temp['link'] = $(this).find('div > a').attr('href')
        temp['price'] = $(this).find('div > span.price > a').text().slice(0,-1)
        data.push(temp)
      }
    })
    if (data.length > 1) {
      data.sort(function (a,b) {
        return Number (a.price.split(",").join("")) - Number (b.price.split(",").join(""))
      })
    }

    await browser.close()
    if (data.length == 0) {
      result['status'] = false
      console.log(data)
    } else {
      result['data'] = data
      result['status'] = true
    }
    resolve(result)
    console.log(result['status'])
    console.log(4)
  })()
}
