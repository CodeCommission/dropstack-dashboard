import React from 'react'
import styled from 'styled-components'
import Helmet from 'react-helmet'

const StyledLayout = styled.div`
  font-family: Consolas, monaco, monospace;
  padding: 0px;
  margin: 0px;
`

const NavigationContainer = styled.div`
`

const ContentContainer = styled.div`
  width: 100vw;
  height: 100vh;
`

const TopNavigationLogin = styled.div`
  color: white;
  display: inline-block;
  font-size: 11px;
  padding: 18px;
`

const NavigationLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 16px;
  text-align: center;
  vertical-align: middle;
  display: inline-block;

  :visited {
    color: white;
  }
  :hover {
    color: white;
  }
`

const TopNavigationTitle = styled.h1`
  color: white;
  display: inline-block;
  margin: 11px;
`

const TopNavigation = styled.nav`
  position: fixed;
  top: 0px;
  width: 100%;
  height: 50px;
`

const TopNavigationList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
`

const TopNavigationListItem = styled.li`
  float: ${props => props.right ? 'right' : 'left'};
`

export default class Layout extends React.Component {
  static async getInitialProps (req, res) {
    const token = req.universalCookies.get('token')
    if(req.url === '/login' || req.url === '/register') return
    if(!token) return res.redirect('/login')

    const jwt = require('jsonwebtoken')
    const {sub} = jwt.decode(token)
    if(!sub) return res.redirect('/login')

    return {userId: sub}
  }

  render () {
    return (
      <StyledLayout>
        <Helmet
          htmlAttributes={{lang: 'en'}}
          bodyAttributes={{style: 'background-color: #422c46; margin: 0px; padding: 0px;'}}
        />
        {
          this.props.userId &&
          <NavigationContainer>
            <TopNavigation>
              <TopNavigationList>
                <TopNavigationListItem><TopNavigationTitle>dropstack</TopNavigationTitle></TopNavigationListItem>
                <TopNavigationListItem><NavigationLink href={'/'}>/dashboard</NavigationLink></TopNavigationListItem>
                <TopNavigationListItem><NavigationLink href={'/about'}>/about</NavigationLink></TopNavigationListItem>
                <TopNavigationListItem><NavigationLink href={'/logout'}>/logout</NavigationLink></TopNavigationListItem>
                <TopNavigationListItem right><TopNavigationLogin>{this.props.userId}</TopNavigationLogin></TopNavigationListItem>
              </TopNavigationList>
            </TopNavigation>
          </NavigationContainer>
        }
        <ContentContainer>
          {this.props.children}
        </ContentContainer>
      </StyledLayout>
    )
  }
}
