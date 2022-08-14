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
      from: '2022-03-30',
      to: '2022-04-01',
      period: 'd',
    })
    .then(
      function (result) {
        const convertedResult = convertHistoricalData(
          result,
          req,
          res,
          template
        )
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
      stock.previousClose = data[
        key
      ].summaryDetail.previousClose.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.open = data[key].summaryDetail.open.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.dayLow = data[key].summaryDetail.dayLow.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.dayHigh = data[key].summaryDetail.dayHigh.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })

      stock.fiftyTwoWeekLow = data[
        key
      ].summaryDetail.fiftyTwoWeekLow.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.fiftyTwoWeekHigh = data[
        key
      ].summaryDetail.fiftyTwoWeekHigh.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.volume = data[key].summaryDetail.volume.toLocaleString('en-NZ')
      stock.totalAssets = data[key].summaryDetail.totalAssets.toLocaleString(
        'en-NZ',
        {
          style: 'currency',
          currency: data[key].price.currency,
        }
      )

      // Add the price data to the stock object
      stock.shortName = data[key].price.shortName
      stock.symbol = data[key].price.symbol
      stock.regularMarketPrice = data[
        key
      ].price.regularMarketPrice.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.exchangeName = data[key].price.exchangeName
      stock.currencySymbol = data[key].price.currencySymbol
    }
    // If data[key].summaryDetail.totalAssets is not defined then it's a stock
    else {
      // Add the summary detail data to the object
      stock.previousClose = data[
        key
      ].summaryDetail.previousClose.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.open = data[key].summaryDetail.open.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.dayLow = data[key].summaryDetail.dayLow.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.dayHigh = data[key].summaryDetail.dayHigh.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })

      stock.fiftyTwoWeekLow = data[
        key
      ].summaryDetail.fiftyTwoWeekLow.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.fiftyTwoWeekHigh = data[
        key
      ].summaryDetail.fiftyTwoWeekHigh.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.volume = data[key].summaryDetail.volume.toLocaleString('en-NZ')
      stock.marketCap =
        data[key].summaryDetail.marketCap.toLocaleString('en-NZ')

      stock.trailingPE = data[key].summaryDetail.trailingPE
      stock.forwardPE = data[key].summaryDetail.forwardPE
      stock.beta = data[key].summaryDetail.beta

      // Add the price data to the stock object
      stock.shortName = data[key].price.shortName
      stock.symbol = data[key].price.symbol
      stock.regularMarketPrice = data[
        key
      ].price.regularMarketPrice.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.exchangeName = data[key].price.exchangeName
      stock.currency = data[key].price.currency
      stock.currencySymbol = data[key].price.currencySymbol

      // Add the financial data to the stock object

      stock.targetLowPrice = data[
        key
      ].financialData.targetLowPrice.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.targetMeanPrice = data[
        key
      ].financialData.targetMeanPrice.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.targetHighPrice = data[
        key
      ].financialData.targetHighPrice.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.targetMedianPrice = data[
        key
      ].financialData.targetMedianPrice.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.recommendationKey =
        data[key].financialData.recommendationKey.toUpperCase()
      stock.numberOfAnalystOpinions =
        data[key].financialData.numberOfAnalystOpinions

      stock.totalCash = data[key].financialData.totalCash.toLocaleString(
        'en-NZ',
        {
          style: 'currency',
          currency: data[key].price.currency,
        }
      )
      stock.totalCashPerShare = data[
        key
      ].financialData.totalCashPerShare.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.totalDebt = data[key].financialData.totalDebt.toLocaleString(
        'en-NZ',
        {
          style: 'currency',
          currency: data[key].price.currency,
        }
      )
      stock.ebitda = data[key].financialData.ebitda.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.totalRevenue = data[key].financialData.totalRevenue.toLocaleString(
        'en-NZ',
        {
          style: 'currency',
          currency: data[key].price.currency,
        }
      )
      stock.grossProfits = data[key].financialData.grossProfits.toLocaleString(
        'en-NZ',
        {
          style: 'currency',
          currency: data[key].price.currency,
        }
      )
      stock.freeCashflow = data[key].financialData.freeCashflow.toLocaleString(
        'en-NZ',
        {
          style: 'currency',
          currency: data[key].price.currency,
        }
      )
      stock.operatingCashflow = data[
        key
      ].financialData.operatingCashflow.toLocaleString('en-NZ', {
        style: 'currency',
        currency: data[key].price.currency,
      })
      stock.earningsGrowth = data[
        key
      ].financialData.earningsGrowth.toLocaleString('en-NZ', {
        style: 'percent',
        minimumFractionDigits: 2,
      })
      stock.revenueGrowth = data[
        key
      ].financialData.revenueGrowth.toLocaleString('en-NZ', {
        style: 'percent',
        minimumFractionDigits: 2,
      })
      stock.grossMargins = data[key].financialData.grossMargins.toLocaleString(
        'en-NZ',
        {
          style: 'percent',
          minimumFractionDigits: 2,
        }
      )
      stock.ebitdaMargins = data[
        key
      ].financialData.ebitdaMargins.toLocaleString('en-NZ', {
        style: 'percent',
        minimumFractionDigits: 2,
      })
      stock.operatingMargins = data[
        key
      ].financialData.operatingMargins.toLocaleString('en-NZ', {
        style: 'percent',
        minimumFractionDigits: 2,
      })
      stock.profitMargins = data[
        key
      ].financialData.profitMargins.toLocaleString('en-NZ', {
        style: 'percent',
        minimumFractionDigits: 2,
      })
    }
    reformattedData['stocks'].push(stock)
  })

  return reformattedData
}

function convertHistoricalData(data, req, res, template) {
  const keys = Object.keys(data)

  const reformattedData = {
    stocks: [],
  }

  // Get the currency
  yahooFinance
    .quote({
      symbols: keys,
      modules: ['price'],
    })
    .then(
      function (result) {
        // Iterate through the stocks we are getting historical data for
        keys.forEach((key) => {
          // Result is an array of objects containing the stock data for multiple days
          // Filter to the correct day in the result and add to the reformattedData object
          data[key].forEach((day) => {
            if (day.date.toLocaleString('en-NZ') == '30/03/2022, 5:00:00 pm') {
              // Create an empty object to store the stock data
              const stock = {}

              // Add the stock data to the object
              stock.symbol = day.symbol
              stock.date = day.date
              stock.open = day.open.toLocaleString('en-NZ', {
                style: 'currency',
                currency: result[key].price.currency,
              })
              stock.high = day.high.toLocaleString('en-NZ', {
                style: 'currency',
                currency: result[key].price.currency,
              })
              stock.low = day.low.toLocaleString('en-NZ', {
                style: 'currency',
                currency: result[key].price.currency,
              })

              stock.close = day.close.toLocaleString('en-NZ', {
                style: 'currency',
                currency: result[key].price.currency,
              })
              // Preserve the full closing price for NZDUSD to allow currency conversions
              if (stock.symbol == 'NZDUSD=X') {
                stock.close = day.close.toLocaleString('en-NZ', {
                  style: 'currency',
                  currency: result[key].price.currency,
                  minimumFractionDigits: 6,
                })
              }
              stock.adjClose = day.adjClose.toLocaleString('en-NZ', {
                style: 'currency',
                currency: result[key].price.currency,
              })
              stock.volume = day.volume.toLocaleString('en-NZ')

              // Format the date to be in the format DD/MM/YYYY
              const date = new Date(stock.date)
              stock.date = new Intl.DateTimeFormat('en-NZ').format(date)

              // Push the stock data to the array
              reformattedData['stocks'].push(stock)
            }
          })
        })

        res.render(template, reformattedData)
      },
      function (err) {
        return `Whoops, something went wrong!\n${err}`
      }
    )

  return reformattedData
}

module.exports = {
  readFile,
  readDetails,
  searchCurrent,
  searchHistorical,
  convertHistoricalData,
}
