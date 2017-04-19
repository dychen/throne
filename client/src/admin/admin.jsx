import React from 'react';

import './admin.scss';

import {AdminSidenav} from './sidenav.jsx';

class AdminPage extends React.Component {
  render() {
    return (
      <div className="thrn-admin-container">
        <AdminSidenav />
        <div className="thrn-admin-main">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export {AdminPage};
