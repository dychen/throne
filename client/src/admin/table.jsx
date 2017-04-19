import React from 'react';
import Reactable from 'reactable';

import './table.scss';

/*
 * props:
 *   COLUMNS [Array]: [{ key: [column API key], label: [column display] }, ...]
 *   COLUMN_KEYS: [Array]: [[column API key], [column API key], ...]
 *   data [Array]: [{ [Model to display] }, ...]
 *   onRowClick [function]: Function to trigger when a row is clicked.
 */
class AdminTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: { column: 'firstName', direction: 1 }
    };

    this.updateSortState = this.updateSortState.bind(this);
  }

  /*
   * Example: { column: 'firstName', direction: -1 }
   */
  updateSortState(newSortState) {
    this.setState({ sort: newSortState });
  }

  render() {
    const columnHeaders = this.props.COLUMNS.map((column) => {
      const ascIconClass = (column.key === this.state.sort.column
                            && this.state.sort.direction === 1) ? 'visible' : '';
      const descIconClass = (column.key === this.state.sort.column
                             && this.state.sort.direction === -1) ? 'visible' : '';
      return (
        <Reactable.Th className={column.key} column={column.key} key={column.key}>
          <strong className="name-header">{column.label}</strong>
          <i className={`ion-arrow-up-b sort-icon sort-asc ${ascIconClass}`} />
          <i className={`ion-arrow-down-b sort-icon sort-desc ${descIconClass}`} />
        </Reactable.Th>
      );
    });
    const rows = this.props.data.map((data) => {
      const cells = this.props.COLUMNS.map((column) => {
        if (column.key === 'photoUrl') {
          return (
            <Reactable.Td key={`${data._id}-${column.key}`}
                          column={column.key}>
              {Reactable.unsafe(`<img src=${data[column.key]} />`)}
            </Reactable.Td>
          );
        }
        else {
          return (
            <Reactable.Td key={`${data._id}-${column.key}`}
                          column={column.key}>
              {data[column.key]}
            </Reactable.Td>
          );
        }
      });
      return (
        <Reactable.Tr key={data._id} id={data._id}
                      onClick={this.props.onRowClick}>
          {cells}
        </Reactable.Tr>
      );
    });
    return (
      <Reactable.Table className="thrn-table"
                       columns={this.props.COLUMNS}
                       itemsPerPage={20} pageButtonLimit={5}
                       sortable={this.props.COLUMN_KEYS}
                       defaultSort={{column: 'firstName'}}
                       onSort={this.updateSortState}
                       filterable={this.props.COLUMN_KEYS}>
        <Reactable.Thead>
          {columnHeaders}
        </Reactable.Thead>
        {rows}
      </Reactable.Table>
    );
  }
}

export {AdminTable};
