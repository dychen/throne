import React from 'react';
import Reactable from 'reactable';
import moment from 'moment';
import 'whatwg-fetch';

import {AdminTable} from './table.jsx';
import {CSVExporter} from './csvexport.jsx';

const transformAPIData = (d) => {
  d.startTime = d.startTime ? moment(d.startTime).format('YYYY-MM-DD HH:mm'): '';
  d.endTime = d.endTime ? moment(d.endTime).format('YYYY-MM-DD HH:mm') : '';
};

class AdminSessionTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      sessions: [],
      users: []
    };

    // Timer methods
    this._tick = this._tick.bind(this);

    // API methods
    this.getSessionList = this.getSessionList.bind(this);
    this.endSessionAPI = this.endSessionAPI.bind(this);
    this.changeTableAPI = this.changeTableAPI.bind(this);

    // Table cell methods
    this.getActiveClassName = this.getActiveClassName.bind(this);
    this.getActiveButtonDisplay = this.getActiveButtonDisplay.bind(this);
    this.endSession = this.endSession.bind(this);
    this.changeTable = this.changeTable.bind(this);
    this.getElapsedTimeDisplay = this.getElapsedTimeDisplay.bind(this);

    this.API_URL = `${SERVER_URL}/api/v1/sessions`;
    this.COLUMNS = [
      { key: 'photoUrl', label: 'Photo' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'startTime', label: 'Start Time' },
      { key: 'endTime', label: 'End Time' },
      { key: 'elapsedTime', label: 'Total Time' },
      { key: 'tableName', label: 'Table' },
      { key: 'active', label: 'Sign Out' }
    ];
    this.CLICKABLE_COLUMNS = {
      active: {
        getClassNameFromValue: this.getActiveClassName,
        getDisplayFromValue: this.getActiveButtonDisplay,
        onClick: this.endSession
      }
    };
    this.DERIVED_COLUMNS = {
      elapsedTime: {
        getDisplayFromRow: this.getElapsedTimeDisplay
      }
    };
    this.COLUMN_KEYS = this.COLUMNS.map((c) => c.key);

    this.getSessionList();
  }

  /* Timer methods */

  componentDidMount() {
    this.TIMER = setInterval(() => { this._tick(); }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.TIMER);
  }

  _tick() {
    this.setState({ date: new Date() });
  }

  getSessionList() {
    fetch(this.API_URL, {
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
      headers: { 'Content-Type': 'application/json' },
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

  changeTableAPI(newTableId, sessionId) {
    fetch(`${SERVER_URL}/api/v1/sessions/tables/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ table: newTableId })
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

  changeTable(e, value, session) {
    e.stopPropagation();
    // Find the table corresponding to the selection and update accordingly.
    // There should only be one since names are unique.
    const tables = this.props.tables.filter((table) => table.name === value);
    // Update
    if (tables && tables.length > 0)
      this.changeTableAPI(tables[0]._id, session._id);
    // Clear out table if the None field is selected
    else
      this.changeTableAPI(undefined, session._id);
  }

  /*
   * Formatting reference:
   *   http://stackoverflow.com/questions/13262621/
   *   how-do-i-use-format-on-a-moment-js-duration
   */
  getElapsedTimeDisplay(session) {
    const startTime = new Date(session.startTime);
    const endTime = session.endTime ? new Date(session.endTime) : this.state.date;
    const diff = moment(endTime).diff(moment(startTime));
    return moment.utc(moment.duration(diff).asMilliseconds()).format('HH:mm:ss');
  }

  render() {
    const DROPDOWN_COLUMNS = {
      tableName: {
        options: ['None'].concat(this.props.tables.map((table) => table.name)),
        onSelect: this.changeTable
      }
    };
    return (
      <div>
        <AdminTable INITIAL_SORT={{ column: 'startTime', direction: -1 }}
                    COLUMNS={this.COLUMNS}
                    CLICKABLE_COLUMNS={this.CLICKABLE_COLUMNS}
                    DROPDOWN_COLUMNS={DROPDOWN_COLUMNS}
                    DERIVED_COLUMNS={this.DERIVED_COLUMNS}
                    COLUMN_KEYS={this.COLUMN_KEYS}
                    data={this.props.filterSessions(this.state.sessions)} />
        <CSVExporter title="sessions"
                     columns={this.COLUMNS}
                     data={this.props.filterSessions(this.state.sessions)} />
      </div>
    );
  }
}

export {AdminSessionTable};
