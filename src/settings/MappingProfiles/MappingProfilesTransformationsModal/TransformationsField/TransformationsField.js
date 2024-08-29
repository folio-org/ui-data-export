import React, {
  memo,
  useMemo, useState,
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
  field: '15%',
  ind1: '10%',
  ind2: '10%',
  subfield: '10%',
};
const visibleColumns = ['isSelected', 'fieldName', 'field', 'ind1', 'ind2', 'subfield'];

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

  const [isShowPlaceholder, setIsShowPlaceholder] = useState(true);

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
    field: record => (
      <TransformationFieldGroup
        record={record}
        validatedTransformations={validatedTransformations[record.order]}
        setValidatedTransformations={setValidatedTransformations}
        setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
        typeOfField="marcField"
        isShowPlaceholder={isShowPlaceholder}
        setIsShowPlaceholder={setIsShowPlaceholder}
      />
    ),
    subfield: record => (
      <TransformationFieldGroup
        record={record}
        validatedTransformations={validatedTransformations[record.order]}
        setValidatedTransformations={setValidatedTransformations}
        setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
        typeOfField="subfield"
        isShowPlaceholder={isShowPlaceholder}
        setIsShowPlaceholder={setIsShowPlaceholder}
      />
    ),
    ind1: record => (
      <TransformationFieldGroup
        record={record}
        validatedTransformations={validatedTransformations[record.order]}
        setValidatedTransformations={setValidatedTransformations}
        setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
        typeOfField="indicator1"
        isShowPlaceholder={isShowPlaceholder}
        setIsShowPlaceholder={setIsShowPlaceholder}
      />
    ),
    ind2: record => (
      <TransformationFieldGroup
        record={record}
        validatedTransformations={validatedTransformations[record.order]}
        setValidatedTransformations={setValidatedTransformations}
        setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
        typeOfField="indicator2"
        isShowPlaceholder={isShowPlaceholder}
        setIsShowPlaceholder={setIsShowPlaceholder}
      />
    ),
  }), [validatedTransformations, setValidatedTransformations, setIsSubmitButtonDisabled, onSelectChange, intl, isShowPlaceholder, setIsShowPlaceholder]);


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
    field: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.field' }),
    ind1: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.ind1' }),
    ind2: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.ind2' }),
    subfield: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.subfield' }),
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
