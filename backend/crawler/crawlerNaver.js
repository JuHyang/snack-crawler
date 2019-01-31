const puppeteer = require ('puppeteer')
const cheerio = require ('cheerio')

var url = "https://search.shopping.naver.com/search/all.nhn?query="


function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

exports.crawlerNaver = function (snackName, resolve) {
  ( async () => {
    var result = new Object()
    result['site'] = "네이버 쇼핑"
    const browser = await puppeteer.launch({headless : true, args : ['--no-sandbox, --disable-setuid-sandbox']})
    const page = await browser.newPage({ context: 'another-context' })
    await page.goto(url + snackName)
    // await page.waitForSelector('#autocompleteWrapper')
    // await page.click("[id=autocompleteWrapper] > input")
    // await page.type("[id=autocompleteWrapper] > input", snackName)
    // await page.click("#autocompleteWrapper > a.co_srh_btn._search.N\3d a\3a SNB\2e search")
    await page.waitForSelector('#_searchContainer')
    var html = await page.content()
    var $ = cheerio.load(html);
    result['link'] = page.url()
    var data = new Array()
    $('div.sort_content > div > ul > li > div.info').each(function (index, ele) {
      var temp = Object()
      temp['name'] = $(this).find('.tit').text().trim()
      temp['link'] = $(this).find('.tit').attr('href')
      var price = $(this).find('span.price > em > span').text().split("최저")
      temp['price'] = price[price.length-1]
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
    console.log(6)
  })()
}
