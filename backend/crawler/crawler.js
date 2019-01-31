const crawler11st = require ('./crawler11st')
const crawlerAuction = require ('./crawlerAuction')
const crawlerCoupang = require ('./crawlerCoupang')
const crawlerGmarket = require ('./crawlerGmarket')
const crawlerInterpark = require ('./crawlerInterpark')
const crawlerNaver = require ('./crawlerNaver')
const crawlerTmon = require ('./crawlerTmon')
const crawlerWemap = require ('./crawlerWemap')

var resultArray = new Array()

var crawl_11st = function (snackName) {
  return new Promise (function (resolve, reject) {
    crawler11st.crawler11st(snackName, resolve)
  })
}

var crawl_Auction = function (snackName) {
  return new Promise (function (resolve, reject) {
    crawlerAuction.crawlerAuction (snackName, resolve)
  })
}

var crawl_Coupang = function (snackName) {
  return new Promise (function (resolve, reject) {
    crawlerCoupang.crawlerCoupang (snackName, resolve)
  })
}

var crawl_Gmarket = function (snackName) {
  return new Promise (function (resolve, reject) {
    crawlerGmarket.crawlerGmarket (snackName, resolve)
  })
}

var crawl_Intepark = function (snackName) {
  return new Promise (function (resolve, reject) {
    crawlerInterpark.crawlerInterpark (snackName, resolve)
  })
}


var crawl_Naver = function (snackName) {
  return new Promise (function (resolve, reject) {
    crawlerNaver.crawlerNaver (snackName, resolve)
  })
}

var crawl_Tmon = function (snackName) {
  return new Promise (function (resolve, reject) {
    crawlerTmon.crawlerTmon (snackName, resolve)
  })
}

var crawl_Wemap = function (snackName) {
  return new Promise (function (resolve, reject) {
    crawlerWemap.crawlerWemap (snackName, resolve)
  })
}

exports.crawler = function (req, res) {
  Promise.all([
    crawl_11st(req.params.snackName),
    crawl_Auction(req.params.snackName),
    crawl_Coupang(req.params.snackName),
    crawl_Gmarket(req.params.snackName),
    crawl_Intepark(req.params.snackName),
    crawl_Naver(req.params.snackName),
    crawl_Tmon(req.params.snackName),
    crawl_Wemap(req.params.snackName)
  ]).then (function (values) {
    console.log("COMPELTE")
    res.send(values)
  })
}
