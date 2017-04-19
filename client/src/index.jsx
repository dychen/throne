import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter} from 'react-router-dom';

import './index.scss';

import {WebsiteHome, WebsiteLogin, WebsiteRegister,
        WebsiteAbout} from './website.jsx';
import {AdminUsers, AdminSessions, AdminPayments} from './admin.jsx';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="thrn-app-container">
          <Route exact path="/" component={WebsiteHome}/>
          <Route path="/home" component={WebsiteHome}/>
          <Route path="/login" component={WebsiteLogin} />
          <Route path="/register" component={WebsiteRegister} />
          <Route path="/about" component={WebsiteAbout} />
          <Route exact path="/admin" component={AdminUsers} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route path="/admin/sessions" component={AdminSessions} />
          <Route path="/admin/payments" component={AdminPayments} />
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
