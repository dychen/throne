import React from 'react';
import {Link} from 'react-router-dom';

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
  render() {
    return (
      <div className="thrn-website-box">
        <span className="thrn-input-header">
          First Name
        </span>
        <input className="thrn-input"
               placeholder="Your first name"/>
        <span className="thrn-input-header">
          Last Name
        </span>
        <input className="thrn-input"
               placeholder="Your last name"/>
        <span className="thrn-input-header">
          Email
        </span>
        <input className="thrn-input"
               placeholder="Your email address"/>
        <span className="thrn-input-header">
          Phone Number
        </span>
        <input className="thrn-input"
               placeholder="Your phone number"/>
        <span className="thrn-input-header">
          Credit Card
        </span>
        <input className="thrn-input"
               placeholder="XXXX-XXXX-XXXX-XXXX"/>
        <span className="thrn-input-header">
          Referrer
        </span>
        <input className="thrn-input"
               placeholder="Name of referrer"/>
        <div className="thrn-button">
          Submit
        </div>
      </div>
    );
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
