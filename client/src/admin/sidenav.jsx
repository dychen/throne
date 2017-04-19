import React from 'react';
import {Link} from 'react-router-dom';

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
          <Link to="/admin/users">
            <div className="thrn-sidenav-item link">
              <i className="ion-person-stalker" />
              <span className="minimized-sidenav-hidden">
                Users
              </span>
            </div>
          </Link>
          <Link to="/admin/sessions">
            <div className="thrn-sidenav-item link">
              <i className="ion-clock" />
              <span className="minimized-sidenav-hidden">
                Sessions
              </span>
            </div>
          </Link>
          <Link to="/admin/payments">
            <div className="thrn-sidenav-item link">
              <i className="ion-cash" />
              <span className="minimized-sidenav-hidden">
                Payments
              </span>
            </div>
          </Link>
        </div>
        <div className="thrn-sidenav-bottom">
        </div>
      </div>
    );
  }
}

export {AdminSidenav};
