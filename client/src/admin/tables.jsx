import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';

import {AdminPage} from './admin.jsx';
import {AdminTable} from './table.jsx';
import {AdminSessionTable} from './sessiontable.jsx';
import {AdminModal} from './modal.jsx';

class AdminTables extends React.Component {
  constructor(props) {
    super(props);

    this.NONE_EVENT_KEY = 'EK-NONE-VIEW';
    this.TABLES_EVENT_KEY = 'EK-TABLES-VIEW';

    this.state = {
      view: this.NONE_EVENT_KEY,
      tables: [],
      modal: {
        visible: false,
        title: '',
        data: {},
        onSave: null
      }
    };

    // Tables
    this.API_URL = `${SERVER_URL}/api/v1/tables`;
    this.COLUMNS = [
      { key: 'name', label: 'Table Name' }
    ];
    this.COLUMN_KEYS = this.COLUMNS.map((c) => c.key);

    // Nav tab methods
    this.changeView = this.changeView.bind(this);
    this.filterSessions = this.filterSessions.bind(this);

    // Table modal methods
    this.showCreateModal = this.showCreateModal.bind(this);
    this.showUpdateModal = this.showUpdateModal.bind(this);
    this.hideModal = this.hideModal.bind(this);

    // Table API methods
    this.getTableList = this.getTableList.bind(this);
    this.createTable = this.createTable.bind(this);
    this.updateTable = this.updateTable.bind(this);
    this.deleteTable = this.deleteTable.bind(this);

    this.getTableList();
  }

  changeView(eventKey, e) {
    this.setState({ view: eventKey });
  }

  filterSessions(sessions) {
    if (this.state.view === this.NONE_EVENT_KEY) {
      const tableIds = this.state.tables.map((table) => table._id);
      return sessions.filter((session) => {
        return !tableIds.includes(session._table) && session.active
      });
    }
    else {
      return sessions.filter((session) => {
        return session._table === this.state.view && session.active
      });
    }
  }

  showCreateModal(e) {
    e.stopPropagation(); // Don't propagate to hideModal() handlers
    this.setState({
      modal: {
        visible: true,
        title: 'Create a table',
        data: {},
        onSave: this.createTable
      }
    });
  }

  showUpdateModal(e) {
    e.stopPropagation(); // Don't propagate to hideModal() handlers
    const tableIdx = this.state.tables.findIndex((table) => {
      return table._id === e.currentTarget.id
    });
    this.setState({
      modal: {
        visible: true,
        title: 'Update a table',
        data: this.state.tables[tableIdx],
        onSave: this.updateTable
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

  getTableList() {
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

  createTable(obj) {
    fetch(this.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(obj)
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

  updateTable(obj, objId) {
    fetch(`${this.API_URL}/${objId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(obj)
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

  deleteTable(objId) {
    fetch(`${this.API_URL}/${objId}`, {
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
    const navItems = this.state.tables.map((table) => {
      return <NavItem key={table._id} eventKey={table._id}>{table.name}</NavItem>;
    });
    let sessionTable;
    if (this.state.view === this.TABLES_EVENT_KEY) {
      sessionTable = (
        <div>
          <div className="thrn-create-button">
            <div className="thrn-button"
                 onClick={this.showCreateModal}>
              Create Table
            </div>
          </div>
          <AdminTable INITIAL_SORT={{ column: 'name', direction: 1 }}
                      COLUMNS={this.COLUMNS}
                      COLUMN_KEYS={this.COLUMN_KEYS}
                      data={this.state.tables}
                      onRowClick={this.showUpdateModal} />
          <AdminModal FIELDS={this.COLUMNS}
                      title={this.state.modal.title}
                      data={this.state.modal.data}
                      visible={this.state.modal.visible}
                      hideModal={this.hideModal}
                      onSave={this.state.modal.onSave}
                      onDelete={this.deleteTable} />
        </div>
      );
    }
    else {
      sessionTable = <AdminSessionTable filterSessions={this.filterSessions}
                                        tables={this.state.tables} />;
    }
    return (
      <AdminPage>
        <div className="thrn-nav-tab-container">
          <Nav className="thrn-view-tabs" bsStyle="tabs"
               activeKey={this.state.view}
               onSelect={this.changeView}>
            <NavItem eventKey={this.NONE_EVENT_KEY}>None</NavItem>
            {navItems}
            <NavItem eventKey={this.TABLES_EVENT_KEY}>Tables</NavItem>
          </Nav>
        </div>
        <div className="thrn-nav-view-container">
          {sessionTable}
        </div>
      </AdminPage>
    );
  }
}

export {AdminTables};
