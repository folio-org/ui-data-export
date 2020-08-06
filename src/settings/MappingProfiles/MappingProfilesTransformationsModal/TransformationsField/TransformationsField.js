import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  isEqual,
  noop,
} from 'lodash';

import {
  TextField,
  MultiColumnList,
  Layout,
  Checkbox,
} from '@folio/stripes/components';

const columnWidths = {
  isSelected: '5%',
  fieldName: '40%',
  transformation: '55%',
};
const visibleColumns = ['isSelected', 'fieldName', 'transformation'];

export const TransformationField = ({
  contentData,
  isSelectAllChecked,
  onSelectChange,
  onSelectAll,
}) => {
  const intl = useIntl();

  const formatter = {
    isSelected: record => (
      <Field
        key={record.displayName}
        name={`transformations[${record.order}].isSelected`}
        type="checkbox"
      >
        { ({ input }) => (
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
        data-test-transformation-field
      >
        <Field
          key={record.displayName}
          component={TextField}
          name={`transformations[${record.order}].transformation`}
          marginBottom0
        />
      </Layout>
    ),
  };

  const selectAllLabel = intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.selectAllFields' });

  const columnMapping = {
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
  };

  return (
    <FieldArray
      name="transformations"
      isEqual={isEqual}
    >
      {({ fields }) => (
        <MultiColumnList
          id="mapping-profiles-form-transformations"
          fields={fields}
          // fields.value is used for now the usage inside MappingProfilesForm
          // and should be removed once that usage is removed
          contentData={contentData || fields.value}
          totalCount={fields.value.length}
          columnMapping={columnMapping}
          columnWidths={columnWidths}
          visibleColumns={visibleColumns}
          formatter={formatter}
        />
      )}
    </FieldArray>
  );
};
TransformationField.defaultProps = {
  isSelectAllChecked: false,
  // TODO: noop is a temp solution to support the previous version.
  // Remove it in UIDEXP-73 and mark the field as required
  onSelectChange: noop,
  onSelectAll: noop,
};

TransformationField.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object.isRequired),
  isSelectAllChecked: PropTypes.bool,
  onSelectChange: PropTypes.func,
  onSelectAll: PropTypes.func,
};
