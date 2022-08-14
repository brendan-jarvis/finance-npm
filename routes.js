const express = require('express')
const router = express.Router()
const utils = require('./utils')

router.get('/', function (req, res) {
  utils.readFile('./data.json', req, res, 'home')
})

router.post('/', function (req, res) {
  utils.searchCurrent(req, res, 'currentResults')
  // res.send(req.body)
})

router.get('/historical', function (req, res) {
  utils.readFile('./data.json', req, res, 'historical')
})

router.post('/historical', function (req, res) {
  utils.searchHistorical(req, res, 'results')
  // res.send(req.body)
})

router.get('/stocks/:symbol', function (req, res) {
  utils.readDetails('./data.json', req, res, 'details')
})

router.get('/example', function (req, res) {
  utils.readFile('./data.json', req, res, 'example')
})

//export this router to use in our index.js
module.exports = router
