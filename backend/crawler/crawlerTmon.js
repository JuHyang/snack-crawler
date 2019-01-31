const puppeteer = require ('puppeteer')
const cheerio = require ('cheerio')

var url = "http://www.ticketmonster.co.kr/"


function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

exports.crawlerTmon = function (snackName, resolve) {
  ( async () => {
    var result = new Object()
    result['site'] = "티몬"
    const browser = await puppeteer.launch({headless : true, args : ['--no-sandbox, --disable-setuid-sandbox']})
    const page = await browser.newPage({ context: 'another-context' })
    await page.goto(url)
    await page.waitForSelector('#top_srch')
    await page.click("[id=top_srch]")
    await page.type("[id=top_srch]", snackName)
    await page.click("[class=btn_search]")
    await page.waitForSelector('.result_info')
    var html = await page.content()
    var $ = cheerio.load(html);
    result['link'] = page.url()
    var data = new Array()
    $('#search_app > div.ct_wrap > section > div > ul > div > div > li').each(function (index, ele) {
      var temp = Object()
      temp['name'] = $(this).find('a > div.deal_info > p > .tx').text().trim()
      temp['link'] = $(this).find('a').attr('href')
      temp['price'] = $(this).find('a > div.deal_info > div.price_area > span > span > .num').text().trim()
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
    console.log(7)
  })()
}
