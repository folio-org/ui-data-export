import React from 'react';
import classNames from 'classnames';

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
    >
      {data.visibleColumns.map(column => (
        <div
          role="gridcell"
          className={css.mclCell}
          style={{ width: data.columnWidths[column] }}
        >
          {data.formatter[column](data.contentData[index])}
        </div>
      ))}
    </div>
  );
});
