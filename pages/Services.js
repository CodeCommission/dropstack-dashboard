import React from 'react'
import styled from 'styled-components'

const ServicesContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin-left: 11px;
  margin-right: 11px;
  font-size: 12px;
`

const TableHead = styled.th`
  text-align: left;
`

export default class Services extends React.Component {
  static async getInitialProps (req, res, ctx) {
    const token = req.universalCookies.get('token')
    return fetch(`${ctx.env.APIURL}/deploys`, {headers: {Authorization: `Bearer ${token}`}})
    .then(response => response.json())
    .then(data => ({services: data}))
  }

  render() {
    return (
      <ServicesContainer>
        <h2># services</h2>
        <table>
          <thead>
            <tr>
              <TableHead>NUM #</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Domain</TableHead>
            </tr>
          </thead>
          <tbody>
          {
            this.props.services &&
            this.props.services.map(x =>
              <tr key={x.serviceName}>
                <td>{x.serviceInstances}</td>
                <td>{x.serviceType.toUpperCase()}</td>
                <td><a href={`https://${x.serviceUrl}`} target="_blank">{x.serviceName}</a></td>
                <td><a href={`https://${x.serviceAlias}`} target="_blank">{x.serviceAlias}</a></td>
              </tr>
            )
          }
          </tbody>
        </table>
      </ServicesContainer>
    )
  }
}
