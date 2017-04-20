import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';

import {AdminPage} from './admin.jsx';
import {AdminSessionTable, TABLES} from './sessiontable.jsx';

class AdminTables extends React.Component {
  constructor(props) {
    super(props);

    this.NAV_OPTIONS = TABLES;

    this.state = {
      view: 'None'
    };

    // Nav tab methods
    this.changeView = this.changeView.bind(this);
    this.filterSessions = this.filterSessions.bind(this);
  }

  changeView(eventKey, e) {
    this.setState({ view: eventKey });
  }

  filterSessions(sessions) {
    return sessions.filter((session) => {
      return session.table === this.state.view && session.active
    });
  }

  render() {
    const navItems = this.NAV_OPTIONS.map((navOption) => {
      return <NavItem key={navOption} eventKey={navOption}>{navOption}</NavItem>;
    });
    return (
      <AdminPage>
        <div className="thrn-nav-tab-container">
          <Nav className="thrn-view-tabs" bsStyle="tabs"
               activeKey={this.state.view}
               onSelect={this.changeView}>
            {navItems}
          </Nav>
        </div>
        <div className="thrn-nav-view-container">
          <AdminSessionTable filterSessions={this.filterSessions} />
        </div>
      </AdminPage>
    );
  }
}

export {AdminTables};
