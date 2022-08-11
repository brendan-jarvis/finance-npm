const express = require('express')
const router = express.Router()
const utils = require('./utils')

router.get('/', function (req, res) {
  utils.readFile('./data.json', req, res, 'home')
})

// router.get('/stocks/:id/', function (req, res) {
//   utils.readDetails('./data.json', req, res, 'edit')
// })

// router.post('/stocks/:id/edit', function (req, res) {
// utils.writeDetailsToFile('./data.json', req, res)
// })

router.get('/stocks/:symbol', function (req, res) {
  utils.readDetails('./data.json', req, res, 'details')
})

//export this router to use in our index.js
module.exports = router
