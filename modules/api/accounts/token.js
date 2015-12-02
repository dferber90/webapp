module.exports = {
  post: (req, res) => {
    const tokenValid = req.auth.isAuthenticated
    return res.json({ status: 'success', payload: { tokenValid } })
  },
}
