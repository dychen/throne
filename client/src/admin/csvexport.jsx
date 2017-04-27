import React from 'react';

import './csvexport.scss';

/*
 * Args:
 *   columns [Array]: List of Objects to map as column headers in the format:
 *     [{ key: [object key], label: [object display] }, ...]
 *   data [Array]: List of objects to transform to a list of lists:
 *     [{ k1: v1, k2: v2, ...}, ...]
 *   addHeader [boolean]: [Optional] Whether to add a header row with column
 *                        displays. Defaults to true.
 */
const formatCSVData = (columns, data, addHeader) => {
  if (!columns || !data)
    return [];

  addHeader = addHeader === undefined ? true : addHead;

  const rowData = data.map((data) => {
    return columns.map((column) => {
      return `${data[column.key]}`;
    })
  });
  if (addHeader)
    return [columns.map((column) => column.label)].concat(rowData);
  return rowData;
};

/*
 * props:
 *   title [string]: File name
 *   columns [Array]: List of keys to map as column headers
 *   data [Array]: List of objects - should be transformed to a list of lists
 */
class CSVExporter extends React.Component {
  constructor(props) {
    super(props);
    this.exportCSV = this.exportCSV.bind(this);
  }

  exportCSV(e) {
    const formattedData = formatCSVData(this.props.columns, this.props.data);
    const csvStr = encodeURIComponent(formattedData.join('\n'));
    let a = document.createElement('a');
    a.href = 'data:attachment/csv,' + csvStr;
    a.target = '_blank';
    a.download = this.props.title + '.csv';
    document.body.appendChild(a);
    a.click();
  }

  render() {
    return (
      <div className="thrn-csv-export-button" onClick={this.exportCSV}>
        <i className="ion-android-download" />
      </div>
    );
  }
}

export {CSVExporter, formatCSVData};

