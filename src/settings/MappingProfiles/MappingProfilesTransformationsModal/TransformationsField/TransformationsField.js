import React, {
  memo,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  isEqual,
  isEmpty,
} from 'lodash';

import { Checkbox } from '@folio/stripes/components';

import { MultiColumnList } from '../../../../components/MultiColumnList';
import { TransformationFieldGroup } from './TransformationFieldGroup';

const columnWidths = {
  isSelected: '5%',
  fieldName: '45%',
  transformation: '50%',
};
const visibleColumns = ['isSelected', 'fieldName', 'transformation'];

export const TransformationField = memo(({
  contentData,
  validatedTransformations = {},
  isSelectAllChecked = false,
  setValidatedTransformations,
  setIsSubmitButtonDisabled,
  onSelectChange,
  onSelectAll,
}) => {
  const intl = useIntl();
  const headerRowHeight = 40;
  const rowHeight = 50;

  const formatter = {
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
      <TransformationFieldGroup
        record={record}
        validatedTransformations={validatedTransformations[record.order]}
        setValidatedTransformations={setValidatedTransformations}
        setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
      />
    ),
  };

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
    contentData: isEmpty(contentData)
      ? contentData
      : [
        {
          ...contentData[0],
          isFirst: true,
        },
        ...contentData.slice(1),
      ],
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
        <MultiColumnList
          headerRowHeight={headerRowHeight}
          rowHeight={rowHeight}
          itemsData={itemsData}
          columnMapping={columnMapping}
        />
      )}
    </FieldArray>
  );
});

TransformationField.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object.isRequired),
  validatedTransformations: PropTypes.objectOf(PropTypes.shape({
    marcField: PropTypes.bool,
    indicator1: PropTypes.bool,
    indicator2: PropTypes.bool,
    subfield: PropTypes.bool,
  })),
  isSelectAllChecked: PropTypes.bool,
  setValidatedTransformations: PropTypes.func.isRequired,
  setIsSubmitButtonDisabled: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
};
