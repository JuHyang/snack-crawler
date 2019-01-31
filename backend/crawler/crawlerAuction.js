const puppeteer = require ('puppeteer')
const cheerio = require ('cheerio')

var url = "http://www.auction.co.kr/"


function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

exports.crawlerAuction = function (snackName, resolve) {
  ( async () => {
    var result = new Object()
    result['site'] = "옥션"
    const browser = await puppeteer.launch({headless : true, args : ['--no-sandbox, --disable-setuid-sandbox']})
    const page = await browser.newPage({ context: 'another-context' })
    await page.goto(url)
    await page.waitForSelector('#txtKeyword')
    await page.click("[id=txtKeyword]")
    await page.type("[id=txtKeyword]", snackName)
    await page.click("[class=search_btn_ok]")
    await page.waitForSelector('#root')
    var html = await page.content()
    var $ = cheerio.load(html);
    result['link'] = page.url()
    var data = new Array()
    $('#section--inner_content_body_container > div:nth-child(1) > div > ul > li').each(function (index, ele) {
      var temp = Object()
      temp['name'] = $(this).find('a.link--description_1').text().trim()
      temp['link'] = $(this).find('a.link--description_1').attr('href')
      temp['price'] = $(this).find('div > span.text--price_number').text()
      data.push(temp)
    })
    $('#section--inner_content_body_container > div > div > div > div > div  > div').each(function (index, ele) {
      if ($(this).find('div.area--itemcard_title > span > a > span.text--title').text().trim() != "") {
        var temp = Object()
        temp['name'] = $(this).find('div.area--itemcard_title > span > a > span.text--title').text().trim()
        temp['link'] = $(this).find('div.area--itemcard_title > span > a').attr('href')
        temp['price'] = $(this).find('div.area--itemcard_price > span > .text--price_seller').text()
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
    }
    else {
      result['data'] = data
      result['status'] = true
    }
    resolve(result)
    console.log(result['status'])
    console.log(2)
  })()
}
