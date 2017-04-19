import React from 'react';
import Reactable from 'reactable';
import moment from 'moment';
import 'whatwg-fetch';

import {AdminPage} from './admin.jsx';
import {AdminModal} from './modal.jsx';

class AdminTables extends React.Component {
  render() {
    return (
      <AdminPage>
        Tables
      </AdminPage>
    );
  }
}

export {AdminTables};
