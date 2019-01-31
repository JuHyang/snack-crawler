const puppeteer = require ('puppeteer')
const cheerio = require ('cheerio')

var url = "http://isearch.interpark.com/isearch?q="


function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

exports.crawlerInterpark = function (snackName, resolve) {
  ( async () => {
    var result = new Object()
    result['site'] = "인터파크"
    const browser = await puppeteer.launch({headless : true, args : ['--no-sandbox, --disable-setuid-sandbox']})
    const page = await browser.newPage({ context: 'another-context' })
    await page.goto(url + snackName)
    await page.waitForSelector('#footerWrap > div.footInfoWrapper > div > div > div.footCustomer > div.customerHeader > h2')
    var html = await page.content()
    var $ = cheerio.load(html);
    result['link'] = page.url()
    var data = new Array()
    $('#_SHOPListLi > li > div.productResultList').each(function (index, ele) {
      var temp = Object()
      temp['name'] = $(this).find('div.info > a').text().trim()
      temp['link'] = $(this).find('div.info > a').attr('href')
      temp['price'] = $(this).find('div.priceArea > div.price > span > a > .number').text().trim()
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
    console.log(5)
  })()
}
