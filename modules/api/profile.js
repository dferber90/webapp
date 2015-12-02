module.exports = {
  put: (req, res) => {
    if (req.auth.userId) {
      res.json({
        status: 'ok',
        data: {
          _id: 1,
          name: 'nick',
        },
      })
    } else {
      res.status(401)
      res.json({
        status: 'no-access',
        data: {},
      })
    }
  },
  get: (req, res) => {
    switch (req.params.id) {
    case '1':
      return res.json({
        status: 'ok',
        data: {
          firstName: 'Dominik',
          lastName: 'F',
          todos: [
            'make this project awesome',
            'unkown',
            'profit',
          ],
        },
      })
    default:
      res.status(404)
      return res.json({ status: 'error' })
    }
  },
}
