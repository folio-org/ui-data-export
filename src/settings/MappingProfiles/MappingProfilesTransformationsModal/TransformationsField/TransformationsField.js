import React, {
  forwardRef,
  useMemo,
} from 'react';
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

import { Row } from './Row';
import { HeaderRow } from './HeaderRow';

const columnWidths = {
  isSelected: '5%',
  fieldName: '45%',
  transformation: '50%',
};
const visibleColumns = ['isSelected', 'fieldName', 'transformation'];

const outerElementType = forwardRef((props, ref) => (
  <div
    id="mapping-profiles-form-transformations"
    ref={ref}
    role="grid"
    {...props}
  />
));

export const TransformationField = React.memo(({
  contentData,
  isSelectAllChecked,
  onSelectChange,
  onSelectAll,
}) => {
  const intl = useIntl();

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
            <AutoSizer>
              {({
                height,
                width,
              }) => (
                <List
                  outerElementType={outerElementType}
                  itemCount={contentData.length + 1}
                  itemSize={50}
                  width={width}
                  height={height}
                >
                  {({
                    index,
                    style,
                  }) => (!index
                    ? (
                      <HeaderRow
                        key="headerRow"
                        style={style}
                        columnMapping={columnMapping}
                        visibleColumns={visibleColumns}
                        columnWidths={columnWidths}
                      />
                    ) : (
                      <Row
                        key={contentData[index - 1].displayNameKey}
                        style={style}
                        isOdd={Boolean(index % 2)}
                        rowData={contentData[index - 1]}
                        formatter={formatter}
                        visibleColumns={visibleColumns}
                        columnWidths={columnWidths}
                      />
                    ))
                  }
                </List>
              )}
            </AutoSizer>
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
