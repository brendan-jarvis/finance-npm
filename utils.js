// import yahooFinance from 'yahoo-finance'
// import chalk from 'chalk'
// import ora from 'ora'
const yahooFinance = require('yahoo-finance')
const fs = require('fs')

// const SYMBOLS = ['AAPL', 'AMZN', 'GOOGL', 'TSLA']
let data = {}

// getStockData(SYMBOLS)

function readFile(fileName, req, res, template) {
  fs.readFile(fileName, (err, data) => {
    if (err) {
      throw err
    }

    const parsedData = JSON.parse(data)

    // Render the stocks in the file to the browser
    res.render(template, parsedData)
  })
}

function readDetails(fileName, req, res, template) {
  // Read file from data.json
  fs.readFile(fileName, (err, data) => {
    if (err) {
      throw err
    }

    const parsedData = JSON.parse(data)

    const stock = parsedData.stocks.find(
      (stock) => stock.symbol == req.params.symbol
    )

    // // Render the stock details to the browser
    res.render(template, stock)
  })
}

function getStockData(symbols) {
  // Add 'NZDUSD=X' to the the symbols array so we can get the currency conversion rate
  symbols.push('NZDUSD=X')

  console.log(`---------------------------------------------`)
  console.log(`Getting stock data for ${symbols.join(', ')}`)

  // Use the yahooFinance module to get the data for the end of the NZ financial year
  yahooFinance
    .historical({
      symbols: symbols,
      // Yahoo Finance Historical data filter is off by one day so we need to add 1 day to the date
      from: '2022-03-31',
      to: '2022-04-01',
      period: 'd',
    })
    .then(
      function (result) {
        console.log(`Loaded stonks data from YahooFinance`)
        // Save the data
        data = result
        // Read the data
        readStockData(data)
      },
      function (err) {
        console.log(`Whoops, something went wrong!\n${err}`)
      }
    )
}

function readStockData(data) {
  console.log(`---------------------------------------------`)

  // Use Object.keys to get an array of the keys in the data object
  const keys = Object.keys(data)

  // Pull out the last entry in the array of keys
  // This is the currency conversion rate
  const currency = keys.pop()

  // Take the inverse of the currency rate to get the USD to NZD rate
  const usdToNzd = 1 / data[currency][0].close

  const stocks = {}

  keys.forEach(function (key) {
    stocks[key] = {
      'USD Value': data[key][0].close,
      'NZD Value': usdToNzd * data[key][0].close,
    }
  })

  console.table(stocks)
}

module.exports = {
  readFile,
  readDetails,
  getStockData,
}
