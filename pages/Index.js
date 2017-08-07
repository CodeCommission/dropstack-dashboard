import React from 'react'
import styled from 'styled-components'

const IndexContainer = styled.div`
  background-color: white;
  margin-top: 50px;
  padding: 10px;
  width: 100vw;
  height: 100vh;
`

export default class Index extends React.Component {
  static async getInitialProps (req, res) {
    const token = req.universalCookies.get('token')
    return fetch(`https://api.cloud.dropstack.run/deploys`, {headers: {Authorization: `Bearer ${token}`}})
    .then(response => response.json())
    .then(data => ({services: data}))
  }

  render() {
    return (
      <IndexContainer>
        <div>
          <h1># services</h1>
          {
            this.props.services &&
            this.props.services.map(x => <div key={x.serviceName}>{x.serviceInstances} - {x.serviceType} - {x.serviceName} - {x.serviceUrl} - {x.serviceAlias}</div>)
          }
        </div>
      </IndexContainer>
    )
  }
}
