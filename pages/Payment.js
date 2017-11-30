export default {
  async getJSON(req, res) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const jwt = require('jsonwebtoken');
    const PouchDB = require('pouchdb');

    const card = {...req.body, object: 'card'};
    const token = req.universalCookies.get('token');
    const {sub} = jwt.decode(token);
    const usersDB = new PouchDB(`${process.env.BASE_URL}/users`);

    return Promise.all([stripe.customers.create({card, email: sub}), usersDB.get(sub)])
      .then(data => Object.assign({}, data[1], {payment: data[0]}))
      .then(data => usersDB.put(data).then(() => data))
      .catch(err => ({error: err.message}));
  }
};
