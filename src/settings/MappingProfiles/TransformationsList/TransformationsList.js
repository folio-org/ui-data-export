import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import { mappingProfileTransformations } from '../MappingProfilesTransformationsModal/TransformationsField/transformations';

import css from './TransformationsList.css';

const columnWidths = {
  fieldName: '45%',
  transformation: '55%',
};
const visibleColumns = ['fieldName', 'transformation'];
const formatter = {
  fieldName: record => mappingProfileTransformations.find(({ path }) => path === record.path).displayName,
  transformation: record => (
    <pre
      title={record.transformation}
      className={css.transformation}
    >
      {record.transformation}
    </pre>
  ),
};

export const TransformationsList = ({ transformations }) => {
  const intl = useIntl();

  const columnMapping = {
    fieldName: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.fieldName' }),
    transformation: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.transformation' }),
  };

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

TransformationsList.propTypes = { transformations: PropTypes.arrayOf(PropTypes.object) };
TransformationsList.defaultProps = { transformations: [] };
