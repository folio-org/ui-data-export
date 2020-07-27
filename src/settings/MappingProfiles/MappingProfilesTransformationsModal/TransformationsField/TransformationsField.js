import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  isEqual,
  identity,
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
  autosize,
  prepareData,
}) => {
  const intl = useIntl();

  const formatter = {
    isSelected: () => (
      <Checkbox
        data-test-select-field
        aria-label={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.selectField' })}
        type="checkbox"
      />
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

  const isSelectedLabel = intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.selectAllFields' });

  const columnMapping = {
    isSelected: (
      <Checkbox
        data-test-select-all-fields
        type="checkbox"
        title={isSelectedLabel}
        aria-label={isSelectedLabel}
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
          contentData={prepareData(fields.value)}
          totalCount={fields.value.length}
          columnMapping={columnMapping}
          columnWidths={columnWidths}
          visibleColumns={visibleColumns}
          formatter={formatter}
          autosize={autosize}
        />
      )}
    </FieldArray>
  );
};

TransformationField.propTypes = {
  autosize: PropTypes.bool.isRequired,
  prepareData: PropTypes.func,
};

TransformationField.defaultProps = { prepareData: identity };
