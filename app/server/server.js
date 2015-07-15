import express from 'express'
import generatePage from './generatePage'

const app = express()
app.use(express.static('public'))

app.get('*', (req, res) => {
  generatePage(req.path, req.query).then(
    html => res.end(html),
    error => res.end(error ? error.toString() : 'Could not generate page')
  )
})

app.listen(3000)
if (__DEV__) console.log('server listening')
