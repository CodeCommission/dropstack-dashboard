import React from 'react';
import styled from 'styled-components';

const AccountContainer = styled.div`
  font-family: Consolas, monaco, monospace;
  width: 100vw;
  height: 100vh;
  margin-left: 11px;
  margin-right: 11px;
  font-size: 12px;
`;

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
`;

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
  :disabled {
    color: #dddddd;
    border: 1px solid #dddddd;
    cursor: not-allowed;
  }
`;

const BillingCardErrorMessage = styled.div`
  color: red;
  width: 300px;
  padding: 5px;
  font-size: 11px;
`;

const BillingCardSuccessMessage = styled.div`
  color: green;
  width: 300px;
  padding: 5px;
  font-size: 11px;
`;

export default class Account extends React.Component {
  state = {
    registerCustomerError: '',
    registerCustomerSuccess: '',
    chargeError: '',
    chargeSuccess: '',
    account: null
  };

  static async getInitialProps(req, res, ctx) {
    const token = req.universalCookies.get('token');
    return fetch(`${ctx.env.APIURL}/auth/account`, {headers: {Authorization: `Bearer ${token}`}})
      .then(response => response.json())
      .then(data => ({account: data, token}));
  }

  registerCustomer() {
    const customerData = {
      number: this.number.value,
      exp_month: this.exp_month.value,
      exp_year: this.exp_year.value,
      cvc: this.cvc.value,
      name: this.name.value
    };

    /*
    4242424242424242
    12
    2018
    123
    */

    fetch('/payment', {credentials: 'include', method: 'POST', body: JSON.stringify(customerData), headers: {'Content-Type': 'application/json'}})
      .then(response => response.json())
      .then(data => {
        if (data.error) return this.setState({registerCustomerError: data.error});
        this.setState({registerCustomerError: '', registerCustomerSuccess: 'Successful registrated', account: data});
      })
      .catch(err => this.setState({registerCustomerError: err.message, registerCustomerSuccess: ''}));
  }

  chargeAmount() {
    const changeData = {amount: this.amount.value};

    fetch('/charge', {credentials: 'include', method: 'POST', body: JSON.stringify(changeData), headers: {'Content-Type': 'application/json'}})
      .then(response => response.json())
      .then(data => {
        if (data.error) return this.setState({chargeError: data.error, chargeSuccess: ''});
        this.setState({chargeError: '', chargeSuccess: 'Successful charged'});
      })
      .catch(err => this.setState({chargeError: err.message, chargeSuccess: ''}));
  }

  render() {
    const account = this.state.account || this.props.account || {};
    const payment = account.payment || {};
    const source = ((payment.sources || {}).data || []).find(x => x.id === payment.default_source) || {};
    return (
      <AccountContainer>
        <h2># account</h2>
        <div>
          <div>
            <strong>Account ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong>&nbsp;{this.props.account.id}
          </div>
          <div>
            <strong>Plan (beta)&nbsp;&nbsp;&nbsp;&nbsp;:</strong>&nbsp;{(this.props.account.metadata || {}).plan || '-'}
          </div>
          <div>
            <strong>JSON Web Token&nbsp;:</strong> {this.props.token}
          </div>
        </div>
        <h2># billing</h2>
        <BillingCardInput type="text" innerRef={x => (this.name = x)} placeholder="Name" defaultValue={source.name} />
        <BillingCardInput type="text" innerRef={x => (this.number = x)} placeholder="Number" defaultValue={source.last4 ? `XXXX-XXXX-XXXX-${source.last4}` : ''} />
        <BillingCardInput type="number" innerRef={x => (this.exp_month = x)} placeholder="Expiration month" defaultValue={source.exp_month} />
        <BillingCardInput type="number" innerRef={x => (this.exp_year = x)} placeholder="Expiration year" defaultValue={source.exp_year} />
        <BillingCardInput type="number" innerRef={x => (this.cvc = x)} placeholder="CVC" />
        <BillingCardButton onClick={() => this.registerCustomer()}>Register</BillingCardButton>
        {this.state.registerCustomerError && <BillingCardErrorMessage>{this.state.registerCustomerError}</BillingCardErrorMessage>}
        {this.state.registerCustomerSuccess && <BillingCardSuccessMessage>{this.state.registerCustomerSuccess}</BillingCardSuccessMessage>}
        <h2># payment</h2>
        <BillingCardInput type="number" innerRef={x => (this.amount = x)} placeholder="Amount in EUR" />
        <BillingCardButton disabled={!payment.default_source} onClick={() => this.chargeAmount()}>
          Fair Pay
        </BillingCardButton>
        {this.state.chargeError && <BillingCardErrorMessage>{this.state.chargeError}</BillingCardErrorMessage>}
        {this.state.chargeSuccess && <BillingCardSuccessMessage>{this.state.chargeSuccess}</BillingCardSuccessMessage>}
      </AccountContainer>
    );
  }
}
