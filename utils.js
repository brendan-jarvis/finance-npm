const yahooFinance = require('yahoo-finance')
const fs = require('fs')

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

    // Render the stock details to the browser
    res.render(template, stock)
  })
}

function searchCurrent(req, res, template) {
  // Split the search at ' ' and ',' to get an array of symbols
  const currentSearchSymbols = req.body.currentSearch.split(/[ ,]+/)

  // Get the stock data for the symbols
  yahooFinance
    .quote({
      symbols: currentSearchSymbols,
      modules: ['price', 'summaryDetail', 'financialData'],
    })
    .then(
      function (result) {
        const convertedResult = convertCurrentData(result)
        res.render(template, convertedResult)
      },
      function (err) {
        return `Whoops, something went wrong!\n${err}`
      }
    )
}

function searchHistorical(req, res, template) {
  // Split the search at ' ' and ',' to get an array of symbols
  const historicalSearchSymbols = req.body.historicalSearch.split(/[ ,]+/)

  // If currency option is checked
  // Add 'NZDUSD=X' to the the symbols array so we can get the currency conversion rate
  if (req.body.addCurrencyHistorical) {
    historicalSearchSymbols.push('NZDUSD=X')
  }

  // Get the stock data for the symbols
  yahooFinance
    .historical({
      symbols: historicalSearchSymbols,
      // Yahoo Finance Historical data filter is off by one day so we need to add 1 day to the date
      // Yahoo Finance historical data is not however off by one day for NZDUSD=X
      from: '2022-03-31',
      to: '2022-04-01',
      period: 'd',
    })
    .then(
      function (result) {
        const convertedResult = convertHistoricalData(result)
        res.render(template, convertedResult)
      },
      function (err) {
        return `Whoops, something went wrong!\n${err}`
      }
    )
}

function convertCurrentData(data) {
  const keys = Object.keys(data)

  const reformattedData = {
    stocks: [],
  }

  keys.forEach((key) => {
    // create an empty object to store the stock data
    const stock = {}

    // If data[key].summaryDetail.totalAssets is defined then it's an ETF
    if (data[key].summaryDetail.totalAssets) {
      // Add the summary detail data to the object
      stock.previousClose = data[key].summaryDetail.previousClose
      stock.open = data[key].summaryDetail.open
      stock.high = data[key].summaryDetail.high
      stock.dayLow = data[key].summaryDetail.dayLow
      stock.dayHigh = data[key].summaryDetail.dayHigh

      stock.fiftyTwoWeekLow = data[key].summaryDetail.fiftyTwoWeekLow
      stock.fiftyTwoWeekHigh = data[key].summaryDetail.fiftyTwoWeekHigh
      stock.volume = data[key].summaryDetail.volume
      stock.totalAssets = data[key].summaryDetail.totalAssets

      // Add the price data to the stock object
      stock.shortName = data[key].price.shortName
      stock.symbol = data[key].price.symbol
      stock.exchangeName = data[key].price.exchangeName
      stock.currencySymbol = data[key].price.currencySymbol
    }
    // If data[key].summaryDetail.totalAssets is not defined then it's a stock
    else {
      // Add the summary detail data to the object
      stock.previousClose = data[key].summaryDetail.previousClose
      stock.open = data[key].summaryDetail.open
      stock.high = data[key].summaryDetail.high
      stock.dayLow = data[key].summaryDetail.dayLow
      stock.dayHigh = data[key].summaryDetail.dayHigh

      stock.fiftyTwoWeekLow = data[key].summaryDetail.fiftyTwoWeekLow
      stock.fiftyTwoWeekHigh = data[key].summaryDetail.fiftyTwoWeekHigh
      stock.volume = data[key].summaryDetail.volume
      stock.marketCap = data[key].summaryDetail.marketCap

      stock.trailingPE = data[key].summaryDetail.trailingPE
      stock.forwardPE = data[key].summaryDetail.forwardPE
      stock.beta = data[key].summaryDetail.beta

      // Add the price data to the stock object
      stock.shortName = data[key].price.shortName
      stock.symbol = data[key].price.symbol
      stock.exchangeName = data[key].price.exchangeName
      stock.currencySymbol = data[key].price.currencySymbol

      // Add the financial data to the stock object

      stock.targetLowPrice = data[key].financialData.targetLowPrice
      stock.targetMeanPrice = data[key].financialData.targetMeanPrice
      stock.targetHighPrice = data[key].financialData.targetHighPrice
      stock.targetMedianPrice = data[key].financialData.targetMedianPrice
      stock.recommendationKey = data[key].financialData.recommendationKey
      stock.numberOfAnalystOpinions =
        data[key].financialData.numberOfAnalystOpinions

      stock.totalCash = data[key].financialData.totalCash
      stock.totalCashPerShare = data[key].financialData.totalCashPerShare
      stock.totalDebt = data[key].financialData.totalDebt
      stock.ebitda = data[key].financialData.ebitda
      stock.totalRevenue = data[key].financialData.totalRevenue
      stock.grossProfits = data[key].financialData.grossProfits
      stock.freeCashflow = data[key].financialData.freeCashflow
      stock.operatingCashflow = data[key].financialData.operatingCashflow
      stock.earningsGrowth = data[key].financialData.earningsGrowth * 100
      stock.revenueGrowth = data[key].financialData.revenueGrowth * 100
      stock.grossMargins = data[key].financialData.grossMargins * 100
      stock.ebitdaMargins = data[key].financialData.ebitdaMargins * 100
      stock.operatingMargins = data[key].financialData.operatingMargins * 100
      stock.profitMargins = data[key].financialData.profitMargins * 100
    }
    reformattedData['stocks'].push(stock)
  })

  return reformattedData
}

function convertHistoricalData(data) {
  const keys = Object.keys(data)

  const reformattedData = {
    stocks: [],
  }

  keys.forEach((key) => {
    // create an empty object to store the stock data
    const stock = {}

    // add the stock data to the object
    stock.symbol = data[key][0].symbol
    stock.name = data[key][0].name
    stock.date = data[key][0].date
    stock.open = data[key][0].open
    stock.high = data[key][0].high
    stock.low = data[key][0].low
    stock.close = data[key][0].close
    stock.adjClose = data[key][0].adjClose
    stock.volume = data[key][0].volume

    const date = new Date(stock.date)
    stock.date = new Intl.DateTimeFormat('en-GB').format(date)

    // add the stock object to the stocks array
    reformattedData['stocks'].push(stock)
  })

  return reformattedData
}

module.exports = {
  readFile,
  readDetails,
  searchCurrent,
  searchHistorical,
  convertHistoricalData,
}
