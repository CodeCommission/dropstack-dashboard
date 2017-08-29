import React from 'react'
import styled from 'styled-components'

const AboutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin-left: 11px;
  margin-right: 11px;
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
