import React from 'react';
import Reactable from 'reactable';
import moment from 'moment';
import 'whatwg-fetch';

import {AdminPage} from './admin.jsx';
import {AdminTable} from './table.jsx';
import {AdminModal} from './modal.jsx';
import {CSVExporter} from './csvexport.jsx';

const transformAPIData = (d) => {
  d.date = moment(d.date).format('YYYY-MM-DD HH:mm');
};

class AdminPayments extends React.Component {
  constructor(props) {
    super(props);

    this.API_URL = `${SERVER_URL}/api/v1/payments`;
    this.COLUMNS = [
      { key: '_user', label: 'User Id' },
      { key: 'photoUrl', label: 'Photo' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'date', label: 'Date' },
      { key: 'type', label: 'Type' },
      { key: 'amount', label: 'Amount' },
      { key: 'paid', label: 'Paid' }
    ];
    this.EDITABLE_COLUMNS = this.COLUMNS.filter((c) => {
      return !['photoUrl', 'firstName', 'lastName'].includes(c.key);
    });
    this.COLUMN_KEYS = this.COLUMNS.map((c) => c.key);

    this.state = {
      payments: [],
      users: [],
      modal: {
        visible: false,
        title: '',
        data: {},
        onSave: null
      }
    };

    // Modal methods
    this.showCreateModal = this.showCreateModal.bind(this);
    this.showUpdateModal = this.showUpdateModal.bind(this);
    this.hideModal = this.hideModal.bind(this);

    // API methods
    this.getPaymentList = this.getPaymentList.bind(this);
    this.createPayment = this.createPayment.bind(this);
    this.updatePayment = this.updatePayment.bind(this);
    this.deletePayment = this.deletePayment.bind(this);

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

  getPaymentList() {
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
     *   data: [UserPayment list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
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
     *   data: [UserPayment list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
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
     *   data: [UserPayment list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
      this.setState({ payments: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  deletePayment(objId) {
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
     *   data: [UserPayment list]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      // Transform dates
      json.data.forEach(transformAPIData);
      this.setState({ payments: json.data });
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
        <div className="thrn-nav-view-container">
          <div className="thrn-create-button">
            <div className="thrn-button"
                 onClick={this.showCreateModal}>
              Create Payment
            </div>
          </div>
          <AdminTable INITIAL_SORT={{ column: 'date', direction: -1 }}
                      COLUMNS={this.COLUMNS}
                      COLUMN_KEYS={this.COLUMN_KEYS}
                      data={this.state.payments}
                      onRowClick={this.showUpdateModal} />
          <CSVExporter title="payments"
                       columns={this.COLUMNS}
                       data={this.state.payments} />
          <AdminModal FIELDS={this.EDITABLE_COLUMNS}
                      title={this.state.modal.title}
                      data={this.state.modal.data}
                      visible={this.state.modal.visible}
                      hideModal={this.hideModal}
                      onSave={this.state.modal.onSave}
                      onDelete={this.deletePayment} />
        </div>
      </AdminPage>
    );
  }
}

export {AdminPayments};
