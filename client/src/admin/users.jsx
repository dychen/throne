import React from 'react';
import Reactable from 'reactable';
import moment from 'moment';
import 'whatwg-fetch';

import {AdminPage} from './admin.jsx';
import {AdminModal} from './modal.jsx';

class AdminUsers extends React.Component {
  constructor(props) {
    super(props);

    this.API_URL = `${SERVER_URL}/api/v1/users`
    this.COLUMNS = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'referrer', label: 'Referrer' },
      { key: 'createdAt', label: 'Registration Date' }
    ];
    this.EDITABLE_COLUMNS = this.COLUMNS.filter((c) => c.key !== 'createdAt');
    this.COLUMN_KEYS = this.COLUMNS.map((c) => c.key);

    this.state = {
      users: [],
      sort: { column: 'firstName', direction: 1 },
      modal: {
        visible: false,
        title: '',
        data: {},
        onSave: null
      }
    };

    this.updateSortState = this.updateSortState.bind(this);

    this.showCreateModal = this.showCreateModal.bind(this);
    this.showUpdateModal = this.showUpdateModal.bind(this);
    this.hideModal = this.hideModal.bind(this);

    this.getUserList = this.getUserList.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);

    this.getUserList();
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

  /*
   * Example: { column: 'firstName', direction: -1 }
   */
  updateSortState(newSortState) {
    this.setState({ sort: newSortState });
  }

  getUserList() {
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
     *   data: [User list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach((d) => {
        d.createdAt = moment(d.createdAt).format('ll')
      });
      this.setState({ users: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  createUser(obj) {
    fetch(this.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
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
     *   data: [User list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach((d) => {
        d.createdAt = moment(d.createdAt).format('ll');
      });
      this.setState({ users: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  updateUser(obj, objId) {
    fetch(`${this.API_URL}/${objId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
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
     *   data: [User list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach((d) => {
        d.createdAt = moment(d.createdAt).format('ll');
      });
      this.setState({ users: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  render() {
    const columnHeaders = this.COLUMNS.map((column) => {
      const ascIconClass = (column.key === this.state.sort.column
                            && this.state.sort.direction === 1) ? 'visible' : '';
      const descIconClass = (column.key === this.state.sort.column
                             && this.state.sort.direction === -1) ? 'visible' : '';
      return (
        <Reactable.Th column={column.key} key={column.key}>
          <strong className="name-header">{column.label}</strong>
          <i className={`ion-arrow-up-b sort-icon sort-asc ${ascIconClass}`} />
          <i className={`ion-arrow-down-b sort-icon sort-desc ${descIconClass}`} />
        </Reactable.Th>
      );
    });
    const rows = this.state.users.map((user) => {
      return (<Reactable.Tr data={user} key={user._id} id={user._id}
                            onClick={this.showUpdateModal} />);
    });
    return (
      <AdminPage>
        <div className="thrn-create-button">
          <div className="thrn-button"
               onClick={this.showCreateModal}>
            Create User
          </div>
        </div>
        <Reactable.Table className="thrn-table"
                         columns={this.COLUMNS}
                         itemsPerPage={20} pageButtonLimit={5}
                         sortable={this.COLUMN_KEYS}
                         defaultSort={{column: 'firstName'}}
                         onSort={this.updateSortState}
                         filterable={this.COLUMN_KEYS}>
          <Reactable.Thead>
            {columnHeaders}
          </Reactable.Thead>
          {rows}
        </Reactable.Table>
        <AdminModal FIELDS={this.EDITABLE_COLUMNS}
                    title={this.state.modal.title}
                    data={this.state.modal.data}
                    visible={this.state.modal.visible}
                    hideModal={this.hideModal}
                    onSave={this.state.modal.onSave} />
      </AdminPage>
    );
  }
}

export {AdminUsers};
