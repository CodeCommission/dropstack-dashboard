export default {
  async getJSON(req, res, ctx) {
    const stripe = require('stripe')(ctx.env.STRIPE_SECRET_KEY)
    const jwt = require('jsonwebtoken')
    const PouchDB = require('pouchdb')

    const token = req.universalCookies.get('token')
    const {sub} = jwt.decode(token)
    const usersDB = new PouchDB(`${ctx.env.BASE_URL}/users`)

    return usersDB.get(sub)
      .then(data => {
        const charge = {...req.body}
        charge.customer = data.payment.id
        charge.currency = 'eur'
        charge.amount = parseInt(charge.amount) * 100
        return stripe.charges.create(charge)
      })
      .catch(err => ({error: err.message}))
  }
}