var express = require('express');
var router = express.Router();
var crawler = require('./../crawler/crawler')

/* GET home page. */
router.get('/crawler/:snackName', function(req, res, next) {
  crawler.crawler(req, res)
});

module.exports = router;
