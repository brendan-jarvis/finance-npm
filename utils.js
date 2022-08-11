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

function search(req, res, template) {
  // Split the search at ' ' and ',' to get an array of symbols
  const symbols = req.body.search.split(/[ ,]+/)

  // If currency option is checked
  // Add 'NZDUSD=X' to the the symbols array so we can get the currency conversion rate
  if (req.body.addCurrency) {
    symbols.push('NZDUSD=X')
  }

  // Get the stock data for the symbols
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
        // res.send(result)
        const convertedResult = convertHistoricalData(result)
        res.render(template, convertedResult)
        // res.send(convertedResult)
      },
      function (err) {
        return `Whoops, something went wrong!\n${err}`
      }
    )
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

    // add the stock object to the stocks array
    reformattedData['stocks'].push(stock)
  })

  return reformattedData
}

module.exports = {
  readFile,
  readDetails,
  search,
  convertHistoricalData,
}
