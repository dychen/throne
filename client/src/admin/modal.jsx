import React from 'react';
import Immutable from 'immutable';
import Autosuggest from 'react-autosuggest';
import 'whatwg-fetch';

import './modal.scss';

class UserField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      suggestions: [],
      userInput: ''
    };

    // Autosuggest methods
    this.getSuggestions = this.getSuggestions.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.onInputChange = this.onInputChange.bind(this);

    this.getUserAutocompleteList = this.getUserAutocompleteList.bind(this);

    this.getUserAutocompleteList();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userId !== nextProps.userId) {
      const userIdx = this.state.users.findIndex((user) => {
        return user._id === nextProps.userId
      });
      if (userIdx > -1 && this.state.users[userIdx]) {
        this.setState({
          userInput: this.getSuggestionValue(this.state.users[userIdx])
        });
      }
    }
  }

  getUserAutocompleteList() {
    fetch(`${SERVER_URL}/api/v1/users/autocomplete`, {
      method: 'GET',
      credentials: 'include'
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
      this.setState({ users: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  getSuggestions(value) {
    const LIMIT = 10;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputValue.length === 0)
      return [];
    else {
      return this.state.users.filter((user) => {
        return (
          `${user.firstName} ${user.lastName} ${user.email} ${user.phone}`
            .toLowerCase().indexOf(inputValue) > -1
        );
      }).slice(0, LIMIT);
    }
  };
  onSuggestionsFetchRequested({value}) {
    this.setState({ suggestions: this.getSuggestions(value) });
  }
  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  }
  onSuggestionSelected(e, {suggestion}) {
    this.props.onSelect(suggestion._id);
  }
  getSuggestionValue(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  renderSuggestion(user) {
    return (
      <div className="suggestion-container">
        <img src={user.photoUrl} />
        <div className="suggestion-text">{user.firstName} {user.lastName}</div>
        <div className="suggestion-subtext">{user.email} {user.phone}</div>
      </div>
    );
  }
  onInputChange(e, {newValue}) {
    this.setState({ userInput: newValue });
  }

  // Docs: https://github.com/moroshko/react-autosuggest#basic-usage
  render() {
    const inputProps = {
      value: this.state.userInput,
      onChange: this.onInputChange
    };
    return (
      <div className="modal-input-field">
        <div className="modal-input-title">
          User (required)
        </div>
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps} />
      </div>
    );
  }
}

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
 *   onDelete [function]: Function that lets the parent component respond to
 *                        "delete" events in the data.
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

    /* Update/save methods */
    this.handleUpdateEntity = this.handleUpdateEntity.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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

  handleUpdateUser(userId) {
    const newState = Immutable.fromJS(this.state).setIn(['data', '_user'], userId);
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

  handleDelete(e) {
    if (this.state.data._id) {
      this.props.onDelete(this.state.data._id);
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
      if (field.key === '_user') {
        return <UserField onSelect={this.handleUpdateUser} key={field.key}
                          userId={this.state.data[field.key]} />
      }
      else {
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
      }
    });

    return (
      <div className={modalShowClass} onClick={this.hideModal}>
        <div className="thrn-modal"
             onClick={this._preventModalClose}>
          <div className="thrn-modal-header">
            {this.props.title}
            <div className="modal-header-button thrn-button"
                 onClick={this.handleDelete}>
              <i className="ion-trash-a" />
            </div>
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
