import yahooFinance from 'yahoo-finance'
import chalk from 'chalk'
import ora from 'ora'

console.log(chalk.redBright('Welcome to Yahoo Finance in the Command Line!'))
console.log(chalk.cyanBright(`---------------------------------------------`))

const SYMBOLS = ['AAPL', 'AMZN', 'GOOGL', 'TSLA']
let data = {}

const spinner = ora(`Loading ${chalk.green('stonks')} data from YahooFinance`)
spinner.color = 'green'
spinner.start() // Start the Ora spinner
getStockData(SYMBOLS)

function getStockData(symbols) {
  // Add 'NZDUSD=X' to the the symbols array so we can get the currency conversion rate
  symbols.push('NZDUSD=X')

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
        // Stop the Ora spinner
        spinner.succeed(
          `Loaded ${chalk.green('stonks')} data from YahooFinance`
        )
        // Save the data
        data = result
        // Read the data
        readStockData(data)
      },
      function (err) {
        console.log(`Whoops, something went wrong!\n${err}`.red)
      }
    )
}

function readStockData(data) {
  console.log(chalk.cyanBright(`---------------------------------------------`))

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
