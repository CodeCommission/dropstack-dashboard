import React from 'react'
import styled from 'styled-components'

const AboutContainer = styled.div`
  background-color: white;
  margin-top: 50px;
  padding: 10px;
  width: 100vw;
  height: 100vh;
`

const AboutHeadline = styled.h1`
`

export default class About extends React.Component {
  render() {
    return (
      <AboutContainer>
        <AboutHeadline>About</AboutHeadline>
      </AboutContainer>
    )
  }
}
