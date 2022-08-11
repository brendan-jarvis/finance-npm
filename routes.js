const express = require('express')
const router = express.Router()
const utils = require('./utils')

router.get('/', function (req, res) {
  // utils.readFile('./data.json', req, res, 'home')
  res.render('home')
})

router.post('/', function (req, res) {
  utils.search(req, res, 'results')
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
