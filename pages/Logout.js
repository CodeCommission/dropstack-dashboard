import React from 'react';

export default {
  async getInitialProps(req, res) {
    req.universalCookies.remove('token');
    res.redirect('/');
  }
};
