const puppeteer = require ('puppeteer')
const cheerio = require ('cheerio')

var url = "http://search.wemakeprice.com/search?search_cate=top&search_keyword="


function delay(time) {
   return new Promise(function(resolve) {
       setTimeout(resolve, time)
   });
}

exports.crawlerWemap = function (snackName, resolve) {
  ( async () => {
    var result = new Object()
    result['site'] = "위메프"
    const browser = await puppeteer.launch({headless : true, args : ['--no-sandbox, --disable-setuid-sandbox']})
    const page = await browser.newPage({ context: 'another-context' })
    await page.goto(url + snackName)
    await page.waitForSelector('#_footer > div > div.footer__company > div.company_info > dl:nth-child(1) > dd:nth-child(2)')
    var html = await page.content()
    var $ = cheerio.load(html);
    result['link'] = page.url()
    var data = new Array()
    $('div.section_list > ul > li > span').each(function (index, ele) {
      if ($(this).find('a > span.box_desc > span > span.price > span.sale').text() != "") {
        var temp = Object()
        temp['name'] = $(this).find('a > span.box_desc > .tit_desc').text().trim()
        temp['link'] = $(this).find('a').attr('href')
        temp['price'] = $(this).find('a > span.box_desc > span > span.price > span.sale').text().trim().slice(0,-1)
        if (temp.price.substr(temp.price.length - 1) == '원') {
          temp.price = temp.price.slice(0,-1)
        }
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
    console.log(8)
  })()
}
