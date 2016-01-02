const fetch = require('isomorphic-fetch')
const API_URL = process.env.API_URL || 'http://localhost:3001/api/v1'
const { checkHttpStatus, parseJSON } = require('../utils/fetch-utils.js')

const checkAPIErrors = result => {
  if (result.reason) throw result
  return result
}

function apiClient({ endpoint, body }) {
  const content = typeof body === 'string' ? body : JSON.stringify(body)
  const normalizedEndpoint = endpoint.charAt(0) === '/' ? endpoint.substr(1) : endpoint
  return (
    fetch(`${API_URL}/${normalizedEndpoint}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: content,
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(checkAPIErrors)
  )
}

module.exports = apiClient
