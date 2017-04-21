import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import Immutable from 'immutable';
import 'whatwg-fetch';

import './website.scss';

import {TABLES} from './constants.jsx';

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
          <NavLink to="/about" className="header-link" activeClassName="active">
            ABOUT
          </NavLink>
          <NavLink to="/admin" className="header-link" activeClassName="active">
            ADMIN
          </NavLink>
        </div>
        <div className="thrn-header-mobile">
          <NavLink to="/home" className="header-link" activeClassName="active">
            <i className="ion-home" />
          </NavLink>
          <NavLink to="/register" className="header-link" activeClassName="active">
            <i className="ion-person-add" />
          </NavLink>
          <NavLink to="/about" className="header-link" activeClassName="active">
            <i className="ion-information-circled" />
          </NavLink>
          <NavLink to="/admin" className="header-link" activeClassName="active">
            <i className="ion-log-in" />
          </NavLink>
        </div>
      </div>
    );
  }
}

class WebsitePage extends React.Component {
  render() {
    return (
      <div className="thrn-website-background">
        <WebsiteHeader />
        <div className="thrn-website-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}

class CardTable extends React.Component {
  render() {
    const players = this.props.players.map((player) => {
      const playerFirstLetter = player.firstName ? `${player.firstName[0]}.` : '';
      const playerName = `${playerFirstLetter} ${player.lastName}`;
      return (
        <div className="table-player" key={player._id}>
          <img className="table-player-photo" src={player.photoUrl} />
          <div className="table-player-name">{playerName}</div>
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

class WebsiteHome extends React.Component {
  constructor(props) {
    super(props);

    this.API_URL = `${SERVER_URL}/api/v1/sessions/tables`;

    this.state = {
      players: []
    };

    this._tick = this._tick.bind(this);
    this.getSessionList = this.getSessionList.bind(this);
    this._filterPlayersByTable = this._filterPlayersByTable.bind(this);

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
      this.setState({ players: json.data });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  _filterPlayersByTable(players, table) {
    return players.filter((player) => player.table === table);
  }

  render() {
    const tables = TABLES.filter((table) => table !== 'None')
                         .map((table) => {
      return (
        <CardTable key={table} name={table}
                   players={this._filterPlayersByTable(this.state.players,
                                                       table)} />
      );
    });
    return (
      <WebsitePage>
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
        creditCard: null,
        referrer: null
      },
      userId: '',
      verificationCode: '',
      page: 'register',
      statusMessage: ''
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleVerificationInput = this.handleVerificationInput.bind(this);
    this.goToVerifyPage = this.goToVerifyPage.bind(this);
    this.goToRegistrationPage = this.goToRegistrationPage.bind(this);
    this.submitRegistration = this.submitRegistration.bind(this);
    this.submitVerification = this.submitVerification.bind(this);

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

  goToVerifyPage(e) {
    this.setState({ page: 'verify' });
  }

  goToRegistrationPage(e) {
    this.setState({ page: 'register' });
  }

  submitRegistration(e) {
    fetch(`${SERVER_URL}/auth/v1/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.profile)
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
     *   data: [User object]
     * }
     */
    .then(json => {
      // Success
      console.log('Success', json);
      this.setState({ page: 'verify', userId: json.data._id });
      return json;
    })
    .catch(err => {
      // Failure
      return err;
    });
  }

  submitVerification(e) {
    fetch(`${SERVER_URL}/auth/v1/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.state.userId,
        code: this.state.verificationCode
      })
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
    if (this.state.profile[field] === null)
      return 'thrn-input';
    else if (field === 'phone' && this.state.profile[field].length !== 10)
      return 'thrn-input invalid';
    else if (this.state.profile[field])
      return 'thrn-input valid';
    else
      return 'thrn-input invalid';
  }

  render() {
    let body;
    switch(this.state.page) {
      case 'verify':
        body = (
          <div className="thrn-website-box">
            <div className="thrn-website-text-group element-aligned">
              A text message with the code has been sent to
              &nbsp;{this.state.profile.phoneNumber}. Enter it here.
            </div>
            <input className="thrn-input"
                   placeholder="Your verification code"
                   value={this.state.verificationCode}
                   onChange={this.handleVerificationInput} />
            <div className="thrn-button"
                 onClick={this.submitVerification}>
              Submit
            </div>
            <div className="thrn-website-text-group">
              <span className="text-group-clickable"
                    onClick={this.submitVerification}>
                Resend verification code
              </span>
            </div>
            <div className="thrn-website-text-group">
              <span className="text-group-clickable"
                    onClick={this.goToRegistrationPage}>
                Go back
              </span>
            </div>
            <div className="thrn-website-text-group">
              <span></span>
            </div>
          </div>
        );
        break;
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
            <span className="thrn-input-header">
              First Name
            </span>
            <input className={this._getProfileInputCSS('firstName')}
                   placeholder="Your first name"
                   name="firstName"
                   value={this.state.profile.firstName}
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Last Name
            </span>
            <input className={this._getProfileInputCSS('lastName')}
                   placeholder="Your last name"
                   name="lastName"
                   value={this.state.profile.lastName}
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Email
            </span>
            <input className={this._getProfileInputCSS('email')}
                   placeholder="Your email address"
                   name="email"
                   value={this.state.profile.email}
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Phone Number
            </span>
            <input className={this._getProfileInputCSS('phone')}
                   placeholder="XXX-XXX-XXXX"
                   name="phone"
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Credit Card
            </span>
            <input className={this._getProfileInputCSS('creditCard')}
                   placeholder="XXXX-XXXX-XXXX-XXXX"
                   name="creditCard"
                   value={this.state.profile.creditCard}
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
              Request Code
            </div>
          </div>
        );
        break;
    }
    return (
      <WebsitePage>
        {body}
      </WebsitePage>
    )
  }
}

class WebsiteAbout extends React.Component {
  render() {
    return (
      <WebsitePage>
        <div className="thrn-website-box">
          <div className="thrn-website-text-group">
            <span className="text-group-bold">Address</span>
            <span>1015 E Braker Ln.</span>
            <span>Ste. 4</span>
            <span>Austin, TX 78753</span>

            <span>Please park around back</span>
          </div>
          <div className="thrn-website-text-group">
            <span className="text-group-bold">Hours</span>
            <span>Monday-Friday: 6pm-3am</span>
            <span>Saturday: 2pm-4am</span>
            <span>Sunday: 2pm-2am</span>
          </div>
          <div className="thrn-website-text-group">
            <span className="text-group-bold">Contact</span>
            <span>robert@thronepoker.com</span>
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

export {WebsitePage, WebsiteHeader, WebsiteHome, WebsiteRegister, WebsiteAbout,
        WebsiteAdmin};
