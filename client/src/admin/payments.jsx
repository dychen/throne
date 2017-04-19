import React from 'react';
import Reactable from 'reactable';
import moment from 'moment';
import 'whatwg-fetch';

import {AdminPage} from './admin.jsx';
import {AdminModal} from './modal.jsx';

class AdminPayments extends React.Component {
  constructor(props) {
    super(props);

    this.API_URL = `${SERVER_URL}/api/v1/payments`
    this.COLUMNS = [
      { key: '_user', label: 'User Id' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'date', label: 'Date' },
      { key: 'type', label: 'Type' },
      { key: 'amount', label: 'Amount' },
      { key: 'paid', label: 'Paid' }
    ];
    this.EDITABLE_COLUMNS = this.COLUMNS.filter((c) => {
      return !['firstName', 'lastName'].includes(c.key);
    });
    this.COLUMN_KEYS = this.COLUMNS.map((c) => c.key);

    this.state = {
      payments: [],
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

    this.getPaymentList = this.getPaymentList.bind(this);
    this.createPayment = this.createPayment.bind(this);
    this.updatePayment = this.updatePayment.bind(this);

    this.getPaymentList();
  }

  showCreateModal(e) {
    e.stopPropagation(); // Don't propagate to hideModal() handlers
    this.setState({
      modal: {
        visible: true,
        title: 'Create a payment',
        data: {},
        onSave: this.createPayment
      }
    });
  }

  showUpdateModal(e) {
    e.stopPropagation(); // Don't propagate to hideModal() handlers
    const paymentIdx = this.state.payments.findIndex((payment) => {
      return payment._id === e.currentTarget.id
    });
    this.setState({
      modal: {
        visible: true,
        title: 'Update a payment',
        data: this.state.payments[paymentIdx],
        onSave: this.updatePayment
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

  getPaymentList() {
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
     *   data: [UserPayment list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach((d) => {
        d.date = moment(d.date).format('YYYY-MM-DD HH:mm');
      });
      this.setState({ payments: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  createPayment(obj) {
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
     *   data: [UserPayment list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach((d) => {
        d.date = moment(d.date).format('YYYY-MM-DD HH:mm');
      });
      this.setState({ payments: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  updatePayment(obj, objId) {
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
     *   data: [UserPayment list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach((d) => {
        d.date = moment(d.date).format('YYYY-MM-DD HH:mm');
      });
      this.setState({ payments: json.data });
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
    const rows = this.state.payments.map((payment) => {
      return (<Reactable.Tr data={payment} key={payment._id} id={payment._id}
                            onClick={this.showUpdateModal} />);
    });
    return (
      <AdminPage>
        <div className="thrn-create-button">
          <div className="thrn-button"
               onClick={this.showCreateModal}>
            Create Payment
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

export {AdminPayments};
