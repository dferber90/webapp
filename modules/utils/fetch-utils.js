function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.reason)
  error.response = response
  throw error
}

const parseJSON = response => response.json()

module.exports = {
  checkHttpStatus,
  parseJSON,
}
