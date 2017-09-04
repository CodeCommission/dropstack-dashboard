export default {
  async getJSON(req, res, ctx) {
    const stripe = require('stripe')(ctx.env.STRIPE_SECRET_KEY)
    const jwt = require('jsonwebtoken')
    const PouchDB = require('pouchdb')

    const card = req.body
    const token = req.universalCookies.get('token')
    const {sub} = jwt.decode(token)
    const usersDB = new PouchDB(`${ctx.env.BASE_URL}/users`)

    return Promise.all([
      stripe.tokens.create({card}),
      usersDB.get(sub),
    ])
    .then(data => usersDB.put(Object.assign({}, data[1], {token: data[0].id, card: data[0].card})).then(() => ({token: data[0].id})))
    .catch(err => ({error: err.message}))
  }
}