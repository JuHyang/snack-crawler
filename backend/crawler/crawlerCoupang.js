const puppeteer = require ('puppeteer')
const cheerio = require ('cheerio')

var url = "https://www.coupang.com/"


function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

exports.crawlerCoupang = function (snackName, resolve) {
  ( async () => {
    var result = new Object()
    result['site'] = "쿠팡"
    const browser = await puppeteer.launch({headless : true, args : ['--no-sandbox, --disable-setuid-sandbox']})
    const page = await browser.newPage({ context: 'another-context' })
    await page.goto(url)
    await page.waitForSelector('#headerSearchKeyword')
    await page.type("[id=headerSearchKeyword]", snackName)
    await page.click("[id=headerSearchBtn]")
    await page.waitForSelector('#footer > div.footer-layer2 > div > div > a > strong')
    var html = await page.content()
    var $ = cheerio.load(html);
    result['link'] = page.url()
    var data = new Array()
    $('#productList > li').each(function (index, ele) {
      var temp = Object()
      temp['name'] = $(this).find('a > dl > dd > div > .name').text().trim()
      temp['link'] = url + $(this).find('a').attr('href')
      temp['price'] = $(this).find('a > dl > dd > div > .price-area > .price-wrap > .price > em >.price-value').text().trim()
      data.push(temp)
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
    console.log(3)
  })()
}
