import React from 'react';
import styled from 'styled-components';
import EventSource from 'eventsource';

const IndexContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin-left: 11px;
  margin-right: 11px;
  font-size: 12px;
`;

const TableHead = styled.th`
  text-align: left;
`;

export default class Index extends React.Component {
  state = {
    activities: []
  };

  static async getInitialProps(req, res, ctx) {
    return {
      token: req.universalCookies.get('token')
    };
  }

  componentDidMount() {
    const es = new EventSource(`${this.props.env.APIURL}/activities/live`, {
      headers: {Authorization: `Bearer ${this.props.token}`}
    });
    es.onmessage = msg => {
      try {
        const activity = JSON.parse(msg.data);
        if (!activity.timestamp) return;
        const activities = this.state.activities.slice(0);
        activities.unshift(activity);
        this.setState({activities});
      } catch (e) {}
    };
  }

  render() {
    return (
      <IndexContainer>
        <h2># activities</h2>
        {this.state.activities.length
          ? this.state.activities.map((x, i) => (
              <div key={i}>
                {new Date(x.timestamp).toLocaleString()} | {x.id} | {x.topic} | {x.activity} | {x.state}
              </div>
            ))
          : 'receiving ...'}
      </IndexContainer>
    );
  }
}
