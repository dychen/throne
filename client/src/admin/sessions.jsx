import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';

import {AdminPage} from './admin.jsx';
import {AdminSessionTable} from './sessiontable.jsx';

class AdminSessions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'active'
    };

    // Nav tab methods
    this.changeView = this.changeView.bind(this);
    this.filterSessions = this.filterSessions.bind(this);
  }

  changeView(eventKey, e) {
    this.setState({ view: eventKey });
  }

  filterSessions(sessions) {
    if (this.state.view === 'active')
      return sessions.filter((session) => session.active);
    else
      return sessions.filter((session) => !session.active);
  }

  render() {
    return (
      <AdminPage>
        <div className="thrn-nav-tab-container">
          <Nav className="thrn-view-tabs" bsStyle="tabs"
               activeKey={this.state.view}
               onSelect={this.changeView}>
            <NavItem eventKey="active">Active</NavItem>
            <NavItem eventKey="inactive">Past</NavItem>
          </Nav>
        </div>
        <div className="thrn-nav-view-container">
          <AdminSessionTable filterSessions={this.filterSessions} />
        </div>
      </AdminPage>
    );
  }
}

export {AdminSessions};
