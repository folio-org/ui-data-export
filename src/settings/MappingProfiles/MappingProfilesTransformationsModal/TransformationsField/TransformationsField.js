import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { isEqual } from 'lodash';

import {
  TextField,
  Layout,
  Checkbox,
} from '@folio/stripes/components';

import { GridRow } from './GridRow';
import { HeaderGridRow } from './HeaderGridRow';

import commonCss from '../../../../common/common.css';

const columnWidths = {
  isSelected: '5%',
  fieldName: '45%',
  transformation: '50%',
};
const visibleColumns = ['isSelected', 'fieldName', 'transformation'];

export const TransformationField = React.memo(({
  contentData,
  isSelectAllChecked,
  onSelectChange,
  onSelectAll,
}) => {
  const intl = useIntl();
  const headerRowHeight = 40;
  const rowHeight = 50;

  const formatter = useMemo(() => ({
    isSelected: record => (
      <Field
        key={record.displayName}
        name={`transformations[${record.order}].isSelected`}
        type="checkbox"
      >
        {({ input }) => (
          <Checkbox
            name={input.name}
            checked={input.checked}
            aria-label={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.selectField' })}
            data-test-select-field
            marginBottom0
            onChange={e => {
              input.onChange(e);
              onSelectChange();
            }}
          />
        )}
      </Field>
    ),
    fieldName: record => record.displayName,
    transformation: record => (
      <Layout
        className="full"
        key={record.displayName}
        data-test-transformation-field
      >
        <Field
          component={TextField}
          name={`transformations[${record.order}].transformation`}
          marginBottom0
        />
      </Layout>
    ),
  }), [intl, onSelectChange]);

  const selectAllLabel = useMemo(() => intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.selectAllFields' }), [intl]);

  const fieldArraySubscription = useMemo(() => ({ values: false }), []);

  const columnMapping = useMemo(() => ({
    isSelected: (
      <Checkbox
        id="select-all-checkbox"
        data-test-select-all-fields
        checked={isSelectAllChecked}
        type="checkbox"
        title={selectAllLabel}
        aria-label={selectAllLabel}
        onChange={onSelectAll}
      />
    ),
    fieldName: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.fieldName' }),
    transformation: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.transformation' }),
  }), [intl, isSelectAllChecked, onSelectAll, selectAllLabel]);

  const itemsData = useMemo(() => ({
    contentData,
    formatter,
    visibleColumns,
    columnWidths,
  }), [contentData, formatter]);

  return (
    <FieldArray
      name="transformations"
      isEqual={isEqual}
      subscription={fieldArraySubscription}
    >
      {() => (
        !contentData.length
          ? <span data-test-list-empty>{intl.formatMessage({ id: 'stripes-components.tableEmpty' })}</span>
          : (
            <div
              className={commonCss.fullScreen}
              id="mapping-profiles-form-transformations"
              role="grid"
            >
              <HeaderGridRow
                columnMapping={columnMapping}
                visibleColumns={visibleColumns}
                columnWidths={columnWidths}
              />
              <AutoSizer>
                {({
                  height,
                  width,
                }) => (
                  <List
                    itemCount={contentData.length}
                    itemSize={rowHeight}
                    width={width}
                    height={height - headerRowHeight}
                    itemData={itemsData}
                  >
                    {GridRow}
                  </List>
                )}
              </AutoSizer>
            </div>
          )
      )}
    </FieldArray>
  );
});

TransformationField.defaultProps = { isSelectAllChecked: false };

TransformationField.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object.isRequired),
  isSelectAllChecked: PropTypes.bool,
  onSelectChange: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
};
