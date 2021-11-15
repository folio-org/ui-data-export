import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { GridCell } from '../GridCell';

import css from './GridRow.css';

export const GridRow = React.memo(({
  data,
  index,
  style,
}) => {
  return (
    <div
      role="row"
      data-row-inner
      className={classNames(css.mclRow, { [css.mclIsOdd]: !(index % 2) })}
      style={style}
      aria-label={data.contentData[index].displayName}
    >
      {data.visibleColumns.map(column => (
        <GridCell
          key={column}
          width={data.columnWidths[column]}
          columnFormatter={data.formatter[column]}
          rowData={data.contentData[index]}
        />
      ))}
    </div>
  );
});

GridRow.propTypes = {
  data: PropTypes.shape({
    visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
    columnWidths: PropTypes.object.isRequired,
    formatter: PropTypes.object.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};
