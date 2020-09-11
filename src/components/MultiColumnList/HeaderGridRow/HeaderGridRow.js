import React from 'react';
import PropTypes from 'prop-types';

import css from './HeaderRow.css';

export const HeaderGridRow = React.memo(({
  visibleColumns,
  columnMapping,
  columnWidths,
}) => {
  return (
    <div
      role="row"
      data-header-row-inner
      className={css.mclHeaderRow}
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

HeaderGridRow.propTypes = {
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnMapping: PropTypes.object.isRequired,
  columnWidths: PropTypes.object.isRequired,
};
