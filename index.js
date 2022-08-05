const yahooFinance = require('yahoo-finance')
const util = require('util')
const colors = require('colors')

// Display a welcome message in red
console.log('Welcome to Yahoo Finance in the Command Line!'.red)

// Example multiple historical from GitHub
// Get the data for the end of the NZ financial year

const SYMBOLS = ['AAPL', 'AMZN', 'GOOGL', 'TSLA']
let data = {}

yahooFinance
  .historical({
    symbols: SYMBOLS,
    from: '2022-03-31',
    to: '2022-04-01',
    period: 'd',
  })
  .then(function (result) {
    data = result
    console.log(`$${data['TSLA'][0].close}`)
  })
