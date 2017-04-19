import React from 'react';
import Immutable from 'immutable';

import './modal.scss';

/*
 * props:
 *   FIELDS [Array]: List of API fields to show as edit fields:
 *     [{ key: [API name], label: [display name] }, ...]
 *   title [String]: Title to display in modal header.
 *   data [Object]: [Optional] Initial object values:
 *     { [fieldName]: [value], ... }
 *   visible [boolean]: Whether or not to show the modal.
 *
 *   hideModal [function]: Function to hide the modal.
 *     f([Object: Event object]) => null
 *   onSave [function]: Function that lets the parent component respond to
 *                      "save" events in the data.
 *     f([Object: new object data]) => null
 */
class AdminModal extends React.Component {
  constructor(props) {
    super(props);

    this._INITIAL_STATE = {};
    this.props.FIELDS.forEach((field) => {
      this._INITIAL_STATE[field.key] = '';
    });

    this.state = {
      data: this._INITIAL_STATE
    };

    /* Helpers */
    this._preventModalClose = this._preventModalClose.bind(this);
    this.hideModal = this.hideModal.bind(this);

    /* Update methods */
    // Called when EditField inputs are saved
    this.handleUpdateEntity = this.handleUpdateEntity.bind(this);
    // Called when the "Save" button is clicked
    this.handleSave = this.handleSave.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible === false
        && nextProps.visible
        && nextProps.visible === true) {
      this.setState({ data: nextProps.data });
      return;
    }
  }

  _preventModalClose(e) {
    e.stopPropagation();
  }

  hideModal(e) {
    this.setState({ data: this._INITIAL_STATE });
    this.props.hideModal(e);
  }

  /* Update methods */

  handleUpdateEntity(e) {
    const field = e.currentTarget.name;
    const value = e.currentTarget.value;
    const newState = Immutable.fromJS(this.state).setIn(['data', field], value);
    this.setState(newState.toJS());
  }

  handleSave(e) {
    // Update
    if (this.state.data._id) {
      this.props.onSave(this.state.data, this.state.data._id);
    }
    // Create
    else {
      this.props.onSave(this.state.data);
    }
    this.hideModal(e);
  }

  render() {
    const modalShowClass = (
      this.props.visible
      ? 'thrn-modal-background show'
      : 'thrn-modal-background'
    );

    /* Selected entity input fields */

    const inputFields = this.props.FIELDS.map((field) => {
      return (
        <div className="modal-input-field" key={field.key}>
          <div className="modal-input-title">
            {field.label}
          </div>
          <input name={field.key}
                 value={this.state.data[field.key]}
                 onChange={this.handleUpdateEntity} />
        </div>
      );
    });

    return (
      <div className={modalShowClass} onClick={this.hideModal}>
        <div className="thrn-modal"
             onClick={this._preventModalClose}>
          <div className="thrn-modal-header">
            {this.props.title}
          </div>
          <div className="thrn-modal-body">
            <div className="modal-body-section">
              {inputFields}
            </div>
          </div>
          <div className="thrn-modal-footer">
            <div className="modal-footer-button left"
                 onClick={this.hideModal}>
              <i className="ion-close" />
              <span>Cancel</span>
            </div>
            <div className="modal-footer-button right"
                 onClick={this.handleSave}>
              <i className="ion-plus" />
              <span>Save</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export {AdminModal};
