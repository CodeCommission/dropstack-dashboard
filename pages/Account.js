import React from 'react'
import styled from 'styled-components'

const AccountContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin-left: 11px;
  margin-right: 11px;
  font-size: 12px;
`

export default class Account extends React.Component {
  static async getInitialProps (req, res, ctx) {
    console.log(ctx.env.STRIPE_SECRET_KEY)
    const token = req.universalCookies.get('token')
    return fetch(`${ctx.env.APIURL}/auth/account`, {headers: {Authorization: `Bearer ${token}`}})
    .then(response => response.json())
    .then(data => ({account: data, token}))
  }

  render() {
    return (
      <AccountContainer>
        <h2># account</h2>
        <div>
          <div><strong>Account ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong>&nbsp;{this.props.account.id}</div>
          <div><strong>Plan (beta)&nbsp;&nbsp;&nbsp;&nbsp;:</strong>&nbsp;{(this.props.account.metadata || {}).plan || '-'}</div>
          <div><strong>JSON Web Token&nbsp;:</strong> {this.props.token}</div>
        </div>
      </AccountContainer>
    )
  }
}
