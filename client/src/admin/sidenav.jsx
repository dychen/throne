import React from 'react';
import {NavLink} from 'react-router-dom';

import './sidenav.scss';

class AdminSidenav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'minimized': false
    };

    this.toggleMinimized = this.toggleMinimized.bind(this);
  }

  toggleMinimized(e) {
    this.setState({ 'minimized': !this.state.minimized });
  }

  render() {
    const sidenavClass = (this.state.minimized
                          ? 'thrn-sidenav minimized' : 'thrn-sidenav');

    return (
      <div className={sidenavClass}>
        <div className="thrn-sidenav-top">
          <div className="thrn-sidenav-item logo"
               onClick={this.toggleMinimized}>
            <i className="ion-navicon nav-hamburger" />
            <span className="minimized-sidenav-hidden">Throne</span>
          </div>
          <NavLink to="/admin/users" activeClassName="active">
            <div className="thrn-sidenav-item link">
              <i className="ion-person-stalker" />
              <span className="minimized-sidenav-hidden">
                Users
              </span>
            </div>
          </NavLink>
          <NavLink to="/admin/sessions" activeClassName="active">
            <div className="thrn-sidenav-item link">
              <i className="ion-clock" />
              <span className="minimized-sidenav-hidden">
                Sessions
              </span>
            </div>
          </NavLink>
          <NavLink to="/admin/tables" activeClassName="active">
            <div className="thrn-sidenav-item link">
              <i className="ion-earth" />
              <span className="minimized-sidenav-hidden">
                Tables
              </span>
            </div>
          </NavLink>
          <NavLink to="/admin/payments" activeClassName="active">
            <div className="thrn-sidenav-item link">
              <i className="ion-cash" />
              <span className="minimized-sidenav-hidden">
                Payments
              </span>
            </div>
          </NavLink>
        </div>
        <div className="thrn-sidenav-bottom">
          <a href="/logout">
            <div className="thrn-sidenav-item link">
              <i className="ion-log-out" />
              <span className="minimized-sidenav-hidden">
                Logout
              </span>
            </div>
          </a>
        </div>
      </div>
    );
  }
}

export {AdminSidenav};
