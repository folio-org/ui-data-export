import React from 'react';
import classNames from 'classnames';

import css from './Row.css';

export const Row = React.memo(({
  rowData,
  formatter,
  style,
  columnWidths,
  visibleColumns,
  isOdd,
}) => {
  return (
    <div
      role="row"
      data-row-inner
      className={classNames(css.mclRow, { [css.mclIsOdd]: isOdd })}
      style={style}
    >
      {
        visibleColumns.map(column => (
          <div
            role="gridcell"
            className={css.mclCell}
            key={column}
            style={{ width: columnWidths[column] }}
          >
            {formatter[column](rowData)}
          </div>
        ))
      }
    </div>
  );
});
