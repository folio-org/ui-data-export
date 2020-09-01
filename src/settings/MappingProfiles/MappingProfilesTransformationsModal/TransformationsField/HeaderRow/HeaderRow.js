import React from 'react';

import css from './HeaderRow.css';

export const HeaderRow = React.memo(({
  visibleColumns,
  style,
  columnMapping,
  columnWidths,
}) => {
  return (
    <div
      role="row"
      data-header-row-inner
      className={css.mclHeaderRow}
      style={style}
    >
      {
        visibleColumns.map(column => (
          <div
            role="columnheader"
            className={css.mclHeaderCell}
            key={column}
            style={{ width: columnWidths[column] }}
          >
            {columnMapping[column]}
          </div>
        ))
      }
    </div>
  );
});
