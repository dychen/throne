import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter} from 'react-router-dom';

import './index.scss';
import './public/css/bootstrap.css';

import {WebsiteHome, WebsiteTables, WebsiteRegister, WebsiteAbout,
        WebsiteAdmin} from './website.jsx';
import {AdminUsers} from './admin/users.jsx';
import {AdminSessions} from './admin/sessions.jsx';
import {AdminTables} from './admin/tables.jsx';
import {AdminPayments} from './admin/payments.jsx';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="thrn-app-container">
          <Route exact path="/" component={WebsiteHome}/>
          <Route exact path="/home" component={WebsiteHome}/>
          <Route path="/tables" component={WebsiteTables}/>
          <Route path="/register" component={WebsiteRegister} />
          <Route path="/about" component={WebsiteAbout} />
          <Route exact path="/admin" component={WebsiteAdmin} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route path="/admin/sessions" component={AdminSessions} />
          <Route path="/admin/tables" component={AdminTables} />
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
