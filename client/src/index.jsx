import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter} from 'react-router-dom';

import './index.scss';

import {WebsitePage, WebsiteHome, WebsiteLogin,
        WebsiteRegister, WebsiteAbout} from './website.jsx';

/*
class AppContainer extends React.Component {
  render() {
    const {main, header} = this.props;

    return (
      <div className="thrn-app-container">
        {header}
        {main}
      </div>
    );
  }
}
*/

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <WebsitePage>
          <Route exact path="/" component={WebsiteHome}/>
          <Route path="/home" component={WebsiteHome}/>
          <Route path="/login" component={WebsiteLogin} />
          <Route path="/register" component={WebsiteRegister} />
          <Route path="/about" component={WebsiteAbout} />
        </WebsitePage>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
