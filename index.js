// const yahooFinance = require('yahoo-finance')
// const colors = require('colors')

import yahooFinance from 'yahoo-finance'
import colors from 'colors'
import ora from 'ora'

// Display a welcome message
console.log(`Welcome to Yahoo Finance in the Command Line!`.red)
console.log(`---------------------------------------------`.blue)
console.log(
  `The basic idea here is to use YahooFinance's historical data to check the closing price of US shares.`
    .green
)
console.log(
  `This is important to know because the closing price affects income tax for NZ investors.\n`
    .green
)

// Example multiple historical from GitHub
// Get the data for the end of the NZ financial year

const SYMBOLS = ['AAPL', 'AMZN', 'GOOGL', 'TSLA']
let data = {}

const spinner = ora(`Loading ${'stonks'.red} data from YahooFinance`).start() // Start the Ora spinner
getStockData(SYMBOLS)

function getStockData(symbols) {
  yahooFinance
    .historical({
      symbols: symbols,
      from: '2022-03-31',
      to: '2022-04-01',
      period: 'd',
    })
    .then(
      function (result) {
        spinner.succeed(`Loaded ${'stonks'.red} data from YahooFinance\n`) // Stop the Ora spinner
        data = result
        console.log(
          `The closing price for ${data['TSLA'][0].symbol} was $${data['TSLA'][0].close}`
        )
        console.log(`\nHere's all of the data we got:`.blue)
        console.log(data)
      },
      function (err) {
        console.log(`Whoops, something went wrong!\n${err}`.red)
      }
    )
}
