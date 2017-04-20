import React from 'react';
import Reactable from 'reactable';
import moment from 'moment';
import 'whatwg-fetch';

import {AdminPage} from './admin.jsx';
import {AdminTable} from './table.jsx';

const transformAPIData = (d) => {
  d.startTime = d.startTime ? moment(d.startTime).format('YYYY-MM-DD HH:mm'): '';
  d.endTime = d.endTime ? moment(d.endTime).format('YYYY-MM-DD HH:mm') : '';
};

class AdminSessions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sessions: [],
      users: []
    };

    // API methods
    this.getSessionList = this.getSessionList.bind(this);
    this.endSessionAPI = this.endSessionAPI.bind(this);

    // Table cell methods
    this.getActiveClassName = this.getActiveClassName.bind(this);
    this.getActiveButtonDisplay = this.getActiveButtonDisplay.bind(this);
    this.endSession = this.endSession.bind(this);

    this.API_URL = `${SERVER_URL}/api/v1/sessions`;
    this.COLUMNS = [
      { key: 'photoUrl', label: 'Photo' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'startTime', label: 'Start Time' },
      { key: 'endTime', label: 'End Time' },
      { key: 'active', label: 'Sign Out' }
    ];
    this.CLICKABLE_COLUMNS = {
      active: {
        getClassNameFromValue: this.getActiveClassName,
        getDisplayFromValue: this.getActiveButtonDisplay,
        onClick: this.endSession
      }
    };
    this.COLUMN_KEYS = this.COLUMNS.map((c) => c.key);

    this.getSessionList();
  }

  getSessionList() {
    fetch(this.API_URL, {
      method: 'GET'
    })
    .then(function(response) {
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
     *   data: [UserSession list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
      this.setState({ sessions: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  endSessionAPI(sessionId) {
    fetch(`${SERVER_URL}/api/v1/sessions/end/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(function(response) {
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
     *   data: [UserSession list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
      this.setState({ sessions: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  // value [bool]: true if the user has an active session, false otherwise
  getActiveClassName(value) {
    return value ? 'red' : 'inactive';
  }

  // value [bool]: true if the user has an active session, false otherwise
  getActiveButtonDisplay(value) {
    return value ? 'End Session' : 'Session Ended';
  }

  endSession(e, value, session) {
    e.stopPropagation();
    // Only handle clicks if the user is active (value is true)
    if (value) {
      this.endSessionAPI(session._id);
    }
  }

  render() {
    return (
      <AdminPage>
        <AdminTable COLUMNS={this.COLUMNS}
                    CLICKABLE_COLUMNS={this.CLICKABLE_COLUMNS}
                    COLUMN_KEYS={this.COLUMN_KEYS}
                    data={this.state.sessions} />
      </AdminPage>
    );
  }
}

export {AdminSessions};
