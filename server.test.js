/**
 *  @jest-environment jsdom
 * */
import request from 'supertest'

import server from './server'

describe('Testing home route /', () => {
  test('Home route loads', () => {
    const expected = 200

    return request(server)
      .get('/')
      .then((resp) => {
        const actual = resp.status

        expect(actual).toBe(expected)
      })
  })
})

describe('Testing /stocks/:id route', () => {
  test('Stock details route loads', () => {
    const expected = 200

    return request(server)
      .get('/stocks/1')
      .then((resp) => {
        const actual = resp.status

        expect(actual).toBe(expected)
      })
  })

  test('Stock loads the correct data', () => {
    const expected = '1,093.99'

    return request(server)
      .get('/stocks/TSLA')
      .then((resp) => {
        document.body.innerHTML = resp.text

        // Get the closing price from the response body

        // Check it matches the expected value
        expect(actual).toBe(expected)
      })
  })
})
