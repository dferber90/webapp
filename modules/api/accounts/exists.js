const emailValidator = require('../../validation/email.js')
const mailAddressTaken = require('./utils/mailAddressTaken.js')

module.exports = {
  post: async (req, res) => {
    const { emailAddress } = req.body

    if (!emailValidator(emailAddress)) {
      return res.json({ reason: 'invalid-email-address' })
    }

    // verify no user with this emailAddress exists
    const isMailAddressTaken = await mailAddressTaken(emailAddress, req.rdb)

    return res.json({ taken: isMailAddressTaken })
  },
}
