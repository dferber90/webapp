class APIClientError extends Error {
  constructor(response) {
    super('invalid-status-code')
    this.response = response
  }
}

async function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const content = await response.json()
  throw new APIClientError(content)
}

const parseJSON = response => response.json()

module.exports = {
  checkHttpStatus,
  parseJSON,
}
