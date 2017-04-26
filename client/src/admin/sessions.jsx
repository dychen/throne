import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';

import {AdminPage} from './admin.jsx';
import {AdminSessionTable} from './sessiontable.jsx';

class AdminSessions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'active',
      tables: []
    };

    // Nav tab methods
    this.changeView = this.changeView.bind(this);
    this.filterSessions = this.filterSessions.bind(this);

    // To populate AdminSessionTable component
    this.getTableList = this.getTableList.bind(this);

    this.getTableList();
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

  getTableList() {
    fetch(`${SERVER_URL}/api/v1/tables`, {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        return response.json().then(json => {
          console.error(json);
          throw new Error(json);
        });
      }
    })
    /*
     * Response format: {
     *   data: [UserTable list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      this.setState({ tables: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
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
          <AdminSessionTable filterSessions={this.filterSessions}
                             tables={this.state.tables} />
        </div>
      </AdminPage>
    );
  }
}

export {AdminSessions};
