import React from 'react'
import styled from 'styled-components'

const AccountContainer = styled.div`
  font-family: Consolas, monaco, monospace;
  width: 100vw;
  height: 100vh;
  margin-left: 11px;
  margin-right: 11px;
  font-size: 12px;
`

const BillingCardInput = styled.input`
  font-family: Consolas, monaco, monospace;
  display: block;
  width: 290px;
  margin: 5px;
  padding: 5px;
  border-radius: 0px;
  border: 0;
  border-bottom: 1px solid black;
  color: black;
`

const BillingCardButton = styled.button`
  font-family: Consolas, monaco, monospace;
  color: black;
  display: block;
  width: 300px;
  margin: 5px;
  padding: 5px;
  border: 1px solid black;
  border-radius: 0px;
  background-color: white;
  cursor: pointer;
`

const BillingCardErrorMessage = styled.div`
  color: red;
  width: 300px;
  padding: 5px;
  font-size: 11px;
`

export default class Account extends React.Component {
  state = {
    error: '',
    token: '',
  }

  static async getInitialProps (req, res, ctx) {
    const token = req.universalCookies.get('token')
    return fetch(`${ctx.env.APIURL}/auth/account`, {headers: {Authorization: `Bearer ${token}`}})
    .then(response => response.json())
    .then(data => ({account: data, token}))
  }

  addCard () {
    const cardData = {
      number: this.number.value,
      exp_month: this.exp_month.value,
      exp_year: this.exp_year.value,
      cvc: this.cvc.value,
    }

    /*
    4242424242424242
    12
    2018
    123
    */

    fetch('/payment', {credentials: 'include', method: 'POST', body: JSON.stringify(cardData), headers: {'Content-Type': 'application/json'}})
    .then(response => response.json())
    .then(data => {
      if(data.error) return this.setState({error: data.error})
      console.log(data)
      this.setState({
        error: '',
        token: data.token,
      })
    })
    .catch(err => this.setState({error: err.message}))
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
        <h2># billing</h2>
        <BillingCardInput type="text" innerRef={x => this.number = x} placeholder="number" />
        <BillingCardInput type="text" innerRef={x => this.exp_month = x} placeholder="expiration month" />
        <BillingCardInput type="text" innerRef={x => this.exp_year = x} placeholder="expiration year" />
        <BillingCardInput type="text" innerRef={x => this.cvc = x} placeholder="cvc" />
        <BillingCardButton onClick={() => this.addCard()}>Add Card</BillingCardButton>
        {
          this.state.error &&
          <BillingCardErrorMessage>{this.state.error}</BillingCardErrorMessage>
        }
      </AccountContainer>
    )
  }
}
