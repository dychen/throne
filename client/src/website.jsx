import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import Immutable from 'immutable';
import 'whatwg-fetch';

import './website.scss';

class WebsiteHeader extends React.Component {
  render() {
    return (
      <div className="thrn-website-header">
        <div className="thrn-header-desktop">
          <NavLink to="/home" className="header-link" activeClassName="active">
            HOME
          </NavLink>
          <NavLink to="/register" className="header-link" activeClassName="active">
            REGISTER
          </NavLink>
          <NavLink to="/tables" className="header-link" activeClassName="active">
            TABLES
          </NavLink>
          <NavLink to="/about" className="header-link" activeClassName="active">
            ABOUT
          </NavLink>
        </div>
        <div className="thrn-header-mobile">
          <NavLink to="/home" className="header-link" activeClassName="active">
            <i className="ion-home" />
          </NavLink>
          <NavLink to="/register" className="header-link" activeClassName="active">
            <i className="ion-person-add" />
          </NavLink>
          <NavLink to="/tables" className="header-link" activeClassName="active">
            <i className="ion-earth" />
          </NavLink>
          <NavLink to="/about" className="header-link" activeClassName="active">
            <i className="ion-information-circled" />
          </NavLink>
        </div>
      </div>
    );
  }
}

class WebsiteFooter extends React.Component {
  render() {
    return (
      <div className="thrn-website-footer">
        <img src='https://s3-us-west-1.amazonaws.com/throne-s3/images/logo-white-clear.png' />
        <span>Throne Social Club</span>
      </div>
    );
  }
}

class WebsitePage extends React.Component {
  render() {
    const className = (this.props.backgroundClass
                       ? `thrn-website-background ${this.props.backgroundClass}`
                       : 'thrn-website-background');
    return (
      <div className={className}>
        <WebsiteHeader />
        <div className="thrn-website-body">
          {this.props.children}
        </div>
        <WebsiteFooter />
      </div>
    );
  }
}

class WebsiteHome extends React.Component {
  render() {
    return (
      <WebsitePage backgroundClass="home">
        <div className="thrn-website-home">
          <div className="thrn-website-home-title">
            <span>Throne Social Club</span>
            <span>Poker for the players</span>
          </div>
          <div className="thrn-website-home-buttons">
            <span className="home-button">
              <a className="text-group-icon" target="_blank"
                 href="https://www.instagram.com/thronepoker/">
                FOLLOW
              </a>
            </span>

            <span className="home-button">
              <NavLink to="/register">
                REGISTER
              </NavLink>
            </span>
          </div>
          <div className="thrn-website-home-subtitle">
            <span>Safe.&nbsp;&nbsp;&nbsp;Secure.&nbsp;&nbsp;&nbsp;Social.</span>
          </div>
        </div>
      </WebsitePage>
    );
  }
}

class CardTable extends React.Component {
  render() {
    const players = this.props.players.map((player, i) => {
      const defaultImageUrl = ('https://s3-us-west-1.amazonaws.com/throne-s3/'
                               + 'images/default-profile.png');
      const imgClassName = "table-player-photo photo-" + (i % 9 + 1);
      return (
        <div className="table-player" key={player._id}>
          <img className={imgClassName} src={defaultImageUrl} />
        </div>
      )
    });
    return (
      <div className="thrn-card-table">
        {players}
        <div className="table-name">
          {this.props.name}
        </div>
      </div>
    );
  }
}

class WebsiteTables extends React.Component {
  constructor(props) {
    super(props);

    this.TABLE_API_URL = `${SERVER_URL}/api/v1/public/tables`;
    this.SESSION_API_URL = `${SERVER_URL}/api/v1/public/sessions`;

    this.state = {
      players: [],
      tables: []
    };

    this._tick = this._tick.bind(this);
    this.getTableList = this.getTableList.bind(this);
    this.getSessionList = this.getSessionList.bind(this);
    this._filterPlayersByTable = this._filterPlayersByTable.bind(this);

    this.getTableList();
    this.getSessionList();
  }

  // Timer methods
  componentDidMount() {
    this.TIMER = setInterval(() => { this._tick(); }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.TIMER);
  }

  _tick() {
    this.getTableList();
    this.getSessionList();
  }

  getTableList() {
    fetch(this.TABLE_API_URL, {
      method: 'GET'
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
      this.setState({ tables: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  getSessionList() {
    fetch(this.SESSION_API_URL, {
      method: 'GET'
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
      this.setState({ players: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  _filterPlayersByTable(players, table) {
    return players.filter((player) => player._table === table._id);
  }

  render() {
    const tables = this.state.tables.map((table) => {
      return (
        <CardTable key={table._id} name={table.name}
                   players={this._filterPlayersByTable(this.state.players,
                                                       table)} />
      );
    });
    return (
      <WebsitePage backgroundClass="tables">
        <div className="thrn-card-table-container">
          {tables}
        </div>
      </WebsitePage>
    );
  }
}

class WebsiteRegister extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        referrer: null
      },
      errorMsg: '',
      userId: '',
      verificationCode: '',
      page: 'register',
      statusMessage: ''
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleVerificationInput = this.handleVerificationInput.bind(this);
    this.submitRegistration = this.submitRegistration.bind(this);

    this._getProfileInputCSS = this._getProfileInputCSS.bind(this);
  }

  handleInput(e) {
    const newState = Immutable.fromJS(this.state)
      .setIn(['profile', e.currentTarget.name], e.currentTarget.value);
    this.setState(newState.toJS());
  }

  handleVerificationInput(e) {
    this.setState({ verificationCode: e.currentTarget.value });
  }

  submitRegistration(e) {
    fetch(`${SERVER_URL}/auth/v1/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.profile)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        return response.json().then(json => {
          console.error(json);
          this.setState({ errorMsg: json.error });
          throw new Error(json);
        });
      }
    })
    /*
     * Response format: {
     *   data: [User object]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      this.setState({ page: 'done' });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  _getProfileInputCSS(field) {
    if (this.state.profile[field] === null) {
      return 'thrn-input';
    }
    else if (field === 'phone') {
      if (this.state.profile[field].length !== 12)
        return 'thrn-input invalid';
      else {
        const phoneNumberArr = this.state.profile[field].split('-');
        if (phoneNumberArr.length === 3 && phoneNumberArr[0].length == 3
            && phoneNumberArr[1].length == 3 && phoneNumberArr[2].length === 4)
          return 'thrn-input valid';
        else
          return 'thrn-input invalid';
      }
    }
    else if (field === 'email') {
      const emailStr = this.state.profile[field];
      if (emailStr.indexOf('@') > -1 && emailStr.indexOf('.com') > -1) {
        return 'thrn-input valid';
      }
      return 'thrn-input invalid';
    }
    else if (this.state.profile[field]) {
      return 'thrn-input valid';
    }
    else {
      return 'thrn-input invalid';
    }
  }

  render() {
    let body;
    switch(this.state.page) {
      case 'done':
        body = (
          <div className="thrn-website-box">
            <div className="thrn-website-text-group">
              Successfully registered
            </div>
          </div>
        );
        break;
      case 'register':
      default:
        body = (
          <div className="thrn-website-box">
            <span className="thrn-form-error">
              {this.state.errorMsg}
            </span>
            <span className="thrn-input-header">
              First Name**
            </span>
            <input className={this._getProfileInputCSS('firstName')}
                   placeholder="Your first name"
                   name="firstName"
                   value={this.state.profile.firstName}
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Last Name**
            </span>
            <input className={this._getProfileInputCSS('lastName')}
                   placeholder="Your last name"
                   name="lastName"
                   value={this.state.profile.lastName}
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Email**
            </span>
            <input className={this._getProfileInputCSS('email')}
                   placeholder="Your email address"
                   name="email"
                   value={this.state.profile.email}
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Phone Number**
            </span>
            <input className={this._getProfileInputCSS('phone')}
                   placeholder="XXX-XXX-XXXX"
                   name="phone"
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Referrer
            </span>
            <input className={this._getProfileInputCSS('referrer')}
                   placeholder="Name of referrer"
                   name="referrer"
                   value={this.state.profile.referrer}
                   onChange={this.handleInput} />
            <div className="thrn-button"
                 onClick={this.submitRegistration}>
              Register
            </div>
          </div>
        );
        break;
    }
    return (
      <WebsitePage backgroundClass="register">
        {body}
      </WebsitePage>
    )
  }
}

class WebsiteAbout extends React.Component {
  render() {
    return (
      <WebsitePage backgroundClass="about">
        <div className="thrn-website-box">
          <div className="thrn-website-text-group">
            <span className="text-group-bold">Overview</span>
            <span>
              Throne Poker is a private, social club that focuses on
              &nbsp;providing a friendly and safe atmosphere for its members.
              &nbsp;There will be no rake or tips taken off the tables.
            </span>
          </div>
          <div className="thrn-website-text-group">
            <span className="text-group-bold">Members</span>
            <span>
              Prospective members must sign up via
              &nbsp;<a href="/register">thronepoker.com/register</a>
            </span>
            <span>No membership fee</span>
            <span>Chair rental rate $10/hr</span>
          </div>
          <div className="thrn-website-text-group">
            <span className="text-group-bold">Address</span>
            <span>1015 E Braker Ln.</span>
            <span>Ste. 4</span>
            <span>Austin, TX 78753</span>

            <span>Please park around back. Entrance is around back.</span>
          </div>
          <div className="thrn-website-text-group">
            <span className="text-group-bold">Hours</span>
            <span>Monday-Friday: 6pm-4am</span>
            <span>Saturday-Sunday: 2pm-4am</span>
          </div>
          <div className="thrn-website-text-group">
            <span className="text-group-bold">Contact</span>
            <span>robert@thronepoker.com</span>
            <span>512-334-9468</span>
            <span className="text-group-social">
              <a className="text-group-icon" target="_blank"
                 href="https://twitter.com/ThronePoker">
                <i className="ion-social-twitter" />
              </a>
              <a className="text-group-icon" target="_blank"
                 href="https://www.facebook.com/ThronePoker">
                <i className="ion-social-facebook" />
              </a>
              <a className="text-group-icon" target="_blank"
                 href="https://www.youtube.com/channel/UCYKW2vgq_1br6SvgxvROYbw">
                <i className="ion-social-youtube" />
              </a>
              <a className="text-group-icon" target="_blank"
                 href="https://www.instagram.com/thronepoker/">
                <i className="ion-social-instagram" />
              </a>
            </span>
          </div>
        </div>
      </WebsitePage>
    );
  }
}

class WebsiteAdmin extends React.Component {
  render() {
    return (
      <WebsitePage>
        <div className="thrn-website-box">
          <a href="/auth/google">
            <div className="thrn-button">
              Login
              <i className="ion-social-google thrn-button-text-icon" />
            </div>
          </a>
        </div>
      </WebsitePage>
    );
  }
}

export {WebsitePage, WebsiteHeader, WebsiteFooter, WebsiteHome, WebsiteTables,
        WebsiteRegister, WebsiteAbout, WebsiteAdmin};
