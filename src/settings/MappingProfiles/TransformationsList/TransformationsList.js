import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import css from './TransformationsList.css';

const columnWidths = {
  fieldName: '50%',
  transformation: '50%',
};
const visibleColumns = ['fieldName', 'transformation'];

export const TransformationsList = ({
  transformations,
  allTransformations,
}) => {
  const intl = useIntl();

  const formatter = useMemo(() => ({
    fieldName: record => {
      const transformation = allTransformations.find(({ fieldId }) => fieldId === record.fieldId);

      return transformation?.displayName;
    },
    transformation: record => (
      <pre
        title={record.transformation}
        className={css.transformation}
      >
        {record.transformation}
      </pre>
    ),
  }), [allTransformations]);

  const columnMapping = useMemo(() => ({
    fieldName: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.fieldName' }),
    transformation: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.transformation' }),
  }), [intl]);

  return (
    <MultiColumnList
      id="mapping-profile-transformations-list"
      contentData={transformations}
      columnMapping={columnMapping}
      columnWidths={columnWidths}
      visibleColumns={visibleColumns}
      formatter={formatter}
      isEmptyMessage={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.emptyMessage' })}
    />
  );
};

TransformationsList.propTypes = {
  transformations: PropTypes.arrayOf(PropTypes.object),
  allTransformations: PropTypes.arrayOf(PropTypes.object).isRequired,
};
TransformationsList.defaultProps = { transformations: [] };
