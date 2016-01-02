function emailValidator(emailAddress) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailAddress)
}

module.exports = emailValidator
