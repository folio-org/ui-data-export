import React from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { isEqual } from 'lodash';

import {
  TextField,
  MultiColumnList,
  Layout,
} from '@folio/stripes/components';

const columnWidths = {
  fieldName: '45%',
  transformation: '55%',
};
const visibleColumns = ['fieldName', 'transformation'];
const formatter = {
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
      />
    </Layout>
  ),
};

export const TransformationField = () => {
  const intl = useIntl();

  const columnMapping = {
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
          contentData={fields.value}
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
