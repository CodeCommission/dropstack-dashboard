import React from 'react'
import styled from 'styled-components'

const RegisterContainer = styled.div`
  font-family: Consolas, monaco, monospace;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -140px;
`

const RegisterInput = styled.input`
  font-family: Consolas, monaco, monospace;
  display: block;
  width: 140px;
  margin: 5px;
  padding: 5px;
  border-radius: 0px;
  border: 1px solid white;
  background-color: #422c46;
  color: white;
`

const RegisterButton = styled.button`
  font-family: Consolas, monaco, monospace;
  display: block;
  width: 153px;
  margin: 5px;
  padding: 5px;
  border: 1px solid white;
  border-radius: 0px;
  background-color: #422c46;
  color: white;
`

const RegistrationMessage = styled.div`
  color: green;
  font-size: 11px;
`

const LoginLink = styled.a`
  color: green;
  :visited {
    color: green;
  }
  :hover {
    color: green;
  }
`

const RegisterLoginLink = styled.a`
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

export default class Register extends React.Component {
  static async getInitialProps (req, res) {
    const isValidPassword = req.body && req.body.username && req.body.password === req.body.vpassword
    return {message: isValidPassword}
  }

  render() {
    return (
      <RegisterContainer>
        {
          !this.props.message &&
          <form method="POST">
            <RegisterInput type="text" name="username" placeholder="email" />
            <RegisterInput type="password" name="password" placeholder="password" />
            <RegisterInput type="password" name="vpassword" placeholder="password" />
            <br/>
            <RegisterButton type="submit">sign up</RegisterButton>
            <RegisterLoginLink href="/login">log in</RegisterLoginLink>
          </form>
        }
        {
          this.props.message &&
          <RegistrationMessage>
            Registrated! go to <LoginLink href="/login">login</LoginLink>
          </RegistrationMessage>
        }
      </RegisterContainer>
    )
  }
}