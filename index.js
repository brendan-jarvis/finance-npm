import yahooFinance from 'yahoo-finance'
import chalk from 'chalk'
import ora from 'ora'

// Display a welcome message
console.log(chalk.redBright('Welcome to Yahoo Finance in the Command Line!'))
console.log(`---------------------------------------------`)
console.log(
  chalk.greenBright(
    `The concept here is to use YahooFinance's historical data to check the closing price of US shares.`
  )
)
console.log(
  chalk.greenBright(
    `This is important to know because the closing price affects income tax for NZ investors.\n`
  )
)

// Based on example historical data for multiple stocks from yahoo-finance documentation
// Get the data for the end of the NZ financial year

const SYMBOLS = ['AAPL', 'AMZN', 'GOOGL', 'TSLA']
let data = {}

const spinner = ora(`Loading ${chalk.green('stonks')} data from YahooFinance`)
spinner.color = 'green'
spinner.start() // Start the Ora spinner
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
        spinner.succeed(
          `Loaded ${chalk.green('stonks')} data from YahooFinance\n`
        ) // Stop the Ora spinner
        data = result
        console.log(
          `The closing price for ${data['TSLA'][0].symbol} was $${data['TSLA'][0].close}`
        )
        console.log(`\nHere's all of the data we got:`)
        console.log(data)
      },
      function (err) {
        console.log(`Whoops, something went wrong!\n${err}`.red)
      }
    )
}
