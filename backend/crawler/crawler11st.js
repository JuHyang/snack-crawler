const puppeteer = require ('puppeteer')
const cheerio = require ('cheerio')

var url = "http://www.11st.co.kr/"


function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

exports.crawler11st = function (snackName, resolve) {
  ( async () => {
    var result = new Object()
    result['site'] = "11번가"
    const browser = await puppeteer.launch({headless : true, args : ['--no-sandbox, --disable-setuid-sandbox']})
    const page = await browser.newPage({ context: 'another-context' })
    await page.goto(url, 'domcontentloaded')
    await page.waitForSelector('#container > section.main_notice > h1')
    await page.click("[id=AKCKwd]")
    await page.type("[id=AKCKwd]", snackName)
    await page.click("[id=gnbTxtAd]")
    await page.waitForSelector('#layBodyWrap')
    var html = await page.content()
    var $ = cheerio.load(html);
    result['link'] = page.url()
    var data = new Array()
    $('#rcmdPrdList > ul > li > div').each(function (index, ele) {
      var temp = Object()
      temp['name'] = $(this).find('a > .pname > p').text().trim()
      temp['link'] = $(this).find('a').attr('href')
      temp['price'] = $(this).find('a > .pname > .price_info > span > .sale_price').text().trim()
      data.push(temp)
    })
    $('div > ul > li > div').each(function (index, ele) {
      if ($(this).find('.list_info > p >a').text().trim() != "") {
        var temp = Object()
        temp['name'] = $(this).find('.list_info > p > a').text().trim()
        temp['link'] = $(this).find('.list_info > p > a').attr('href')
        temp['price'] = $(this).find('.list_price > .price_box > span > .sale_price').text().trim()
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
    console.log(1)
  })()

}
