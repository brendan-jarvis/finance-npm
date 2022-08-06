# finance-npm
Using the yahoo-finance NPM: https://www.npmjs.com/package/yahoo-finance

The concept here is to use YahooFinance's historical data to check the closing price of US shares. This is important to know because the closing price affects income tax for NZ investors.

The function getStockData an array of symbols and returns Yahoo Finance historical data for 30 March - closing value for the NZ tax year. It also fetches the currency rate for USD/NZD and displays the closing price in NZD.

# Example
```JavaScript
const SYMBOLS = ['AAPL', 'AMZN', 'GOOGL', 'TSLA']

getStockData(SYMBOLS)

{
  AAPL: [
    {
      date: 2022-03-30T04:00:00.000Z,
      open: 178.550003,
      high: 179.610001,
      low: 176.699997,
      close: 177.770004,
      adjClose: 177.509201,
      volume: 92633200,
      symbol: 'AAPL'
    }
  ],
  AMZN: [
    {
      date: 2022-03-30T04:00:00.000Z,
      open: 168.509506,
      high: 168.9505,
      low: 165.5,
      close: 166.300995,
      adjClose: 166.300995,
      volume: 56168000,
      symbol: 'AMZN'
    }
  ],
  GOOGL: [
    {
      date: 2022-03-30T04:00:00.000Z,
      open: 142.460007,
      high: 142.720505,
      low: 141.600006,
      close: 141.938507,
      adjClose: 141.938507,
      volume: 19884000,
      symbol: 'GOOGL'
    }
  ],
  TSLA: [
    {
      date: 2022-03-30T04:00:00.000Z,
      open: 1091.170044,
      high: 1113.949951,
      low: 1084,
      close: 1093.98999,
      adjClose: 1093.98999,
      volume: 19955000,
      symbol: 'TSLA'
    }
  ]
}
```