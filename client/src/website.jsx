import React from 'react';
import {Link} from 'react-router-dom';
import Immutable from 'immutable';
import 'whatwg-fetch';

import './website.scss';

class WebsiteHeader extends React.Component {
  render() {
    return (
      <div className="thrn-website-header">
        <Link to="/home" className="header-link">HOME</Link>
        <Link to="/login" className="header-link">LOGIN</Link>
        <Link to="/register" className="header-link">REGISTER</Link>
        <Link to="/about" className="header-link">ABOUT</Link>
      </div>
    );
  }
}

class WebsiteHome extends React.Component {
  render() {
    return (
      <div className="thrn-website-box">
        <span className="thrn-input-header">
          Request more info
        </span>
        <input className="thrn-input"
               placeholder="your.email@gmail.com"/>
        <Link to="/login">
          <div className="thrn-button">
            Login
          </div>
        </Link>
        <Link to="/register">
          <div className="thrn-button">
            Register
          </div>
        </Link>
      </div>
    );
  }
}

class WebsiteLogin extends React.Component {
  render() {
    return (
      <div className="thrn-website-box">
        <span className="thrn-input-header">
          Enter phone number
        </span>
        <input className="thrn-input"
               placeholder="XXX-XXX-XXXX"/>
        <div className="thrn-button">
          Send code via text
        </div>
        <span className="thrn-input-header">
          Enter code
        </span>
        <input className="thrn-input"
               placeholder="XXXXXX"/>
      </div>
    );
  }
}

class WebsiteRegister extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        creditCard: '',
        referrer: ''
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

  render() {
    switch(this.state.page) {
      case 'verify':
        return (
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
      case 'done':
        return (
          <div className="thrn-website-box">
            <div className="thrn-website-text-group">
              Successfully registered
            </div>
          </div>
        );
      case 'register':
      default:
        return (
          <div className="thrn-website-box">
            <span className="thrn-input-header">
              First Name
            </span>
            <input className="thrn-input"
                   placeholder="Your first name"
                   name="firstName"
                   value={this.state.profile.firstName}
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Last Name
            </span>
            <input className="thrn-input"
                   placeholder="Your last name"
                   name="lastName"
                   value={this.state.profile.lastName}
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Email
            </span>
            <input className="thrn-input"
                   placeholder="Your email address"
                   name="email"
                   value={this.state.profile.email}
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Phone Number
            </span>
            <input className="thrn-input"
                   placeholder="XXX-XXX-XXXX"
                   name="phone"
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Credit Card
            </span>
            <input className="thrn-input"
                   placeholder="XXXX-XXXX-XXXX-XXXX"
                   name="creditCard"
                   value={this.state.profile.creditCard}
                   onChange={this.handleInput} />
            <span className="thrn-input-header">
              Referrer
            </span>
            <input className="thrn-input"
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
  }
}

class WebsiteAbout extends React.Component {
  render() {
    return (
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

export {WebsitePage, WebsiteHeader, WebsiteHome, WebsiteLogin, WebsiteRegister,
        WebsiteAbout};
