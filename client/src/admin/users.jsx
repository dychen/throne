import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import moment from 'moment';
import 'whatwg-fetch';

import {AdminPage} from './admin.jsx';
import {AdminTable} from './table.jsx';
import {AdminModal} from './modal.jsx';

const transformAPIData = (d) => {
  d.createdAt = moment(d.createdAt).format('ll');
};

class AdminUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'verified',
      users: [],
      modal: {
        visible: false,
        title: '',
        data: {},
        onSave: null
      }
    };

    // Nav tab methods
    this.changeView = this.changeView.bind(this);
    this._filterUsers = this._filterUsers.bind(this);

    // Modal methods
    this.showCreateModal = this.showCreateModal.bind(this);
    this.showUpdateModal = this.showUpdateModal.bind(this);
    this.hideModal = this.hideModal.bind(this);

    // API methods
    this.getUserList = this.getUserList.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.startSessionAPI = this.startSessionAPI.bind(this);
    this.verifyUserAPI = this.verifyUserAPI.bind(this);

    // Table cell methods
    this.getActiveClassName = this.getActiveClassName.bind(this);
    this.getActiveButtonDisplay = this.getActiveButtonDisplay.bind(this);
    this.startSession = this.startSession.bind(this);
    this.getUnverifiedClassName = this.getUnverifiedClassName.bind(this);
    this.getUnverifiedButtonDisplay = this.getUnverifiedButtonDisplay.bind(this);
    this.verifyUser = this.verifyUser.bind(this);

    // Constants
    this.API_URL = `${SERVER_URL}/api/v1/users`;
    // Active table
    this.ACTIVE_COLUMNS = [
      { key: 'photoUrl', label: 'Photo' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'referrer', label: 'Referrer' },
      { key: 'createdAt', label: 'Registration Date' },
      { key: 'active', label: 'Sign In' }
    ];
    this.ACTIVE_CLICKABLE_COLUMNS = {
      active: {
        getClassNameFromValue: this.getActiveClassName,
        getDisplayFromValue: this.getActiveButtonDisplay,
        onClick: this.startSession
      }
    };
    this.ACTIVE_COLUMN_KEYS = this.ACTIVE_COLUMNS.map((c) => c.key);
    // Unverified table
    this.UNVERIFIED_COLUMNS = [
      { key: 'photoUrl', label: 'Photo' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'referrer', label: 'Referrer' },
      { key: 'createdAt', label: 'Registration Date' },
      { key: 'verify', label: 'Verify' }
    ];
    this.UNVERIFIED_CLICKABLE_COLUMNS = {
      verify: {
        getClassNameFromValue: this.getUnverifiedClassName,
        getDisplayFromValue: this.getUnverifiedButtonDisplay,
        onClick: this.verifyUser
      }
    };
    this.UNVERIFIED_COLUMN_KEYS = this.UNVERIFIED_COLUMNS.map((c) => c.key);

    this.EDITABLE_COLUMNS = this.ACTIVE_COLUMNS.filter((c) => {
      return !['createdAt', 'active', 'verify'].includes(c.key);
    });

    this.getUserList();
  }

  changeView(eventKey, e) {
    this.setState({ view: eventKey });
  }

  _filterUsers(users) {
    if (this.state.view === 'verified')
      return users.filter((user) => user.verified);
    else
      return users.filter((user) => !user.verified);
  }

  showCreateModal(e) {
    e.stopPropagation(); // Don't propagate to hideModal() handlers
    this.setState({
      modal: {
        visible: true,
        title: 'Create a user',
        data: {},
        onSave: this.createUser
      }
    });
  }

  showUpdateModal(e) {
    e.stopPropagation(); // Don't propagate to hideModal() handlers
    const userIdx = this.state.users.findIndex((user) => {
      return user._id === e.currentTarget.id
    });
    this.setState({
      modal: {
        visible: true,
        title: 'Update a user',
        data: this.state.users[userIdx],
        onSave: this.updateUser
      }
    });
  }

  hideModal(e) {
    e.stopPropagation(); // Don't propagate to showModal() handlers
    this.setState({
      modal: {
        visible: false,
        title: '',
        data: {},
        onSave: null
      }
    });
  }

  getUserList() {
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
     *   data: [User list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
      this.setState({ users: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  createUser(user) {
    fetch(this.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(user)
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
     *   data: [User list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
      this.setState({ users: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  updateUser(user, userId) {
    fetch(`${this.API_URL}/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(user)
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
     *   data: [User list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
      this.setState({ users: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  deleteUser(userId) {
    fetch(`${this.API_URL}/${userId}`, {
      method: 'DELETE',
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
     *   data: [User list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
      this.setState({ users: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  startSessionAPI(userId) {
    fetch(`${SERVER_URL}/api/v1/sessions/start/${userId}`, {
      method: 'POST',
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
     *   data: [User list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
      this.setState({ users: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  verifyUserAPI(userId) {
    fetch(`${SERVER_URL}/api/v1/users/${userId}/verify`, {
      method: 'POST',
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
     *   data: [User list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
      this.setState({ users: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  // value [bool]: true if the user has an active session, false otherwise
  getActiveClassName(value) {
    return value ? 'inactive' : 'green';
  }

  // value [bool]: true if the user has an active session, false otherwise
  getActiveButtonDisplay(value) {
    return value ? 'Session Started' : 'Start Session';
  }

  startSession(e, value, user) {
    e.stopPropagation();
    // Only handle clicks if the user is inactive (value is false)
    if (!value) {
      this.startSessionAPI(user._id);
    }
  }

  getUnverifiedClassName(value) {
    return 'green';
  }

  getUnverifiedButtonDisplay(value) {
    return 'Verify';
  }

  verifyUser(e, value, user) {
    e.stopPropagation();
    this.verifyUserAPI(user._id);
  }


  render() {
    let adminTable;
    if (this.state.view === 'unverified') {
      adminTable = (
        <AdminTable INITIAL_SORT={{ column: 'createdAt', direction: -1 }}
                    COLUMNS={this.UNVERIFIED_COLUMNS}
                    CLICKABLE_COLUMNS={this.UNVERIFIED_CLICKABLE_COLUMNS}
                    COLUMN_KEYS={this.UNVERIFIED_COLUMN_KEYS}
                    data={this._filterUsers(this.state.users)}
                    onRowClick={this.showUpdateModal} />
      );
    }
    else {
      adminTable = (
        <AdminTable INITIAL_SORT={{ column: 'firstName', direction: 1 }}
                    COLUMNS={this.ACTIVE_COLUMNS}
                    CLICKABLE_COLUMNS={this.ACTIVE_CLICKABLE_COLUMNS}
                    COLUMN_KEYS={this.ACTIVE_COLUMN_KEYS}
                    data={this._filterUsers(this.state.users)}
                    onRowClick={this.showUpdateModal} />
      );
    }
    return (
      <AdminPage>
        <div className="thrn-nav-tab-container">
          <Nav bsStyle="tabs"
               activeKey={this.state.view}
               onSelect={this.changeView}>
            <NavItem eventKey="verified">Users</NavItem>
            <NavItem eventKey="unverified">Unverified</NavItem>
          </Nav>
        </div>
        <div className="thrn-nav-view-container">
          <div className="thrn-create-button">
            <div className="thrn-button"
                 onClick={this.showCreateModal}>
              Create User
            </div>
          </div>
          {adminTable}
          <AdminModal FIELDS={this.EDITABLE_COLUMNS}
                      title={this.state.modal.title}
                      data={this.state.modal.data}
                      visible={this.state.modal.visible}
                      hideModal={this.hideModal}
                      onSave={this.state.modal.onSave}
                      onDelete={this.deleteUser} />
        </div>
      </AdminPage>
    );
  }
}

export {AdminUsers};
