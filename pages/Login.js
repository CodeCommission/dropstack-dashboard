import React from 'react'
import styled from 'styled-components'

const LoginContainer = styled.div`
  font-family: Consolas, monaco, monospace;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -140px;
`

const LoginInput = styled.input`
  font-family: Consolas, monaco, monospace;
  color: white;
  display: block;
  width: 140px;
  margin: 5px;
  padding: 5px;
  border: 1px solid white;
  background-color: #422c46;
`

const LoginButton = styled.button`
  font-family: Consolas, monaco, monospace;
  color: white;
  display: block;
  width: 153px;
  margin: 5px;
  padding: 5px;
  border: 1px solid white;
  border-radius: 0px;
  background-color: #422c46;
`

const LoginErrorMessage = styled.div`
  color: red;
  width: 153px;
  padding: 5px;
  font-size: 11px;
`

const LoginRegisterLink = styled.a`
  font-size: 11px;
  color: white;
  width: 153px;
  text-align: center;
  padding: 5px;
  vertical-align: middle;
  display: inline-block;

  :visited {
    color: white;
  }
  :hover {
    color: white;
  }
`

export default class Login extends React.Component {
  static async getInitialProps (req, res) {
    if(!(req.body.username && req.body.password)) return

    const basicAuth = Buffer.from(`${req.body.username}:${req.body.password}`).toString('base64')
    return fetch(`https://api.cloud.dropstack.run/auth/login`, {method:'POST', headers: {Authorization: `Basic ${basicAuth}`}})
    .then(response => {
      if(response.status !== 200) return Promise.reject(new Error('login failed retry please'))
      return response.json()
    })
    .then(data => {
      req.universalCookies.set('token', data.token)
      res.redirect('/')
    })
    .catch(error => ({error: error.message}))
  }

  render() {
    return (
      <LoginContainer>
        <form method="POST">
          <LoginInput type="text" name="username" placeholder="email" />
          <LoginInput type="password" name="password" placeholder="password" />
          <br />
          <LoginButton type="submit">login</LoginButton>
          <LoginRegisterLink href="/register">sign up</LoginRegisterLink>
        </form>
        {
          this.props.error &&
          <LoginErrorMessage>{this.props.error}</LoginErrorMessage>
        }
      </LoginContainer>
    )
  }
}
