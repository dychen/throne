import React from 'react';
import Reactable from 'reactable';
import {DropdownButton, MenuItem} from 'react-bootstrap';

import './table.scss';

/*
 * props:
 *   value: Underlying value
 *   data [Object]: Row object containing the cell
 *   getDisplayFromValue [function]: Function to compute button display text
 *                                   based on the value
 *   getClassNameFromValue [function]: Function to compute CSS class based on
 *                                     the value
 *   onClick [function]: Function to execute when the button is clicked
 */
class ButtonCell extends React.Component {
  constructor(props) {
    super(props);

    this.getDisplayFromValue = this.getDisplayFromValue.bind(this);
    this.getDisplayFromValue = this.getDisplayFromValue.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  getDisplayFromValue(value) {
    if (this.props.getDisplayFromValue)
      return this.props.getDisplayFromValue(value);
    else
      return value;
  }
  getClassNameFromValue(value) {
    if (this.props.getClassNameFromValue)
      return this.props.getClassNameFromValue(value);
    else
      return '';
  }
  onClick(e) {
    this.props.onClick(e, this.props.value, this.props.data);
  }

  render() {
    const className = this.getClassNameFromValue(this.props.value);
    return (
      <div className={`thrn-cell-button ${className}`}>
        <div className="thrn-button"
             onClick={this.onClick}>
          {this.getDisplayFromValue(this.props.value)}
        </div>
      </div>
    );
  }
};

/*
 * props:
 *   value: Underlying value
 *   data [Object]: Row object containing the cell
 *   options [Array]: List of option strings to choose from
 *   onSelect [function]: Function to execute when an option is selected
 */
class DropdownCell extends React.Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(eventKey, e) {
    this.props.onSelect(e, eventKey, this.props.data);
  }

  render() {
    const menuItems = this.props.options.map((option) => {
      return (
        <MenuItem key={option} eventKey={option} onSelect={this.onSelect}>
          {option}
        </MenuItem>
      );
    });
    return (
      <div className="thrn-cell-dropdown">
        <DropdownButton id={`thrn-cell-dropdown-${this.props.data._id}`}
                        title={this.props.value}>
          {menuItems}
        </DropdownButton>
      </div>
    );
  }
}

/*
 * props:
 *   INITIAL_SORT [Object]: { column: [column API key], direction: [1 or -1] }
 *   COLUMNS [Array]: [{ key: [column API key], label: [column display] }, ...]
 *                    Each column object can optionally have the additional
 *                    keys onClick, getClassNameFromValue, and
 *                    getDisplayFromValue (all functions)
 *   CLICKABLE_COLUMNS [Object]: { key: {
 *     getDisplayFromValue: [function],
 *     getClassNameFromValue: [function],
 *     onClick: [function]
 *   }
 *   COLUMN_KEYS: [Array]: [[column API key], [column API key], ...]
 *   data [Array]: [{ [Model to display] }, ...]
 *   onRowClick [function]: Function to trigger when a row is clicked.
 */
class AdminTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: this.props.INITIAL_SORT || { column: 'firstName', direction: 1 }
    };

    this.onRowClick = this.onRowClick.bind(this);
    this.updateSortState = this.updateSortState.bind(this);
  }

  onRowClick(e) {
    if (this.props.onRowClick)
      this.props.onRowClick(e);
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
        // Images
        if (column.key === 'photoUrl') {
          return (
            <Reactable.Td className="photo-container"
                          key={`${data._id}-${column.key}`}
                          column={column.key}>
              {Reactable.unsafe(`<img src=${data[column.key]} />`)}
            </Reactable.Td>
          );
        }
        // Buttons
        else if (this.props.CLICKABLE_COLUMNS
                 && this.props.CLICKABLE_COLUMNS[column.key]) {
          const buttonProps = this.props.CLICKABLE_COLUMNS[column.key];
          return (
            <Reactable.Td key={`${data._id}-${column.key}`}
                          column={column.key}>
              <ButtonCell value={data[column.key]}
                          data={data}
                          getClassNameFromValue={buttonProps.getClassNameFromValue}
                          getDisplayFromValue={buttonProps.getDisplayFromValue}
                          onClick={buttonProps.onClick} />
            </Reactable.Td>
          );
        }
        // Dropdowns
        else if (this.props.DROPDOWN_COLUMNS
                 && this.props.DROPDOWN_COLUMNS[column.key]) {
          const dropdownProps = this.props.DROPDOWN_COLUMNS[column.key];
          return (
            <Reactable.Td key={`${data._id}-${column.key}`}
                          column={column.key}>
              <DropdownCell value={data[column.key]}
                            data={data}
                            options={dropdownProps.options}
                            onSelect={dropdownProps.onSelect} />
            </Reactable.Td>
          );
        }
        // Derived columns - only takes one attribute: getDisplayFromRow
        else if (this.props.DERIVED_COLUMNS
                 && this.props.DERIVED_COLUMNS[column.key]) {
          const dropdownProps = this.props.DERIVED_COLUMNS[column.key];
          return (
            <Reactable.Td key={`${data._id}-${column.key}`}
                          column={column.key}>
              {dropdownProps.getDisplayFromRow(data)}
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
                      onClick={this.onRowClick}>
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
