import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { orderBy } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';

import css from './TransformationsList.css';

const columnWidths = {
  fieldName: '50%',
  transformation: '50%',
};
const visibleColumns = ['fieldName', 'transformation'];

export const TransformationsList = ({
  transformations = [],
  allTransformations,
}) => {
  const [sortedTransformations, setSortedTransformations] = useState([]);
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

  useEffect(() => {
    const formattedTransformations = orderBy(transformations.map(transformation => ({
      fieldName: formatter.fieldName(transformation),
      transformation: formatter.transformation(transformation),
    })), 'fieldName', 'asc');

    setSortedTransformations(formattedTransformations);
  }, [transformations, formatter]);

  return (
    <MultiColumnList
      id="mapping-profile-transformations-list"
      contentData={sortedTransformations}
      columnMapping={columnMapping}
      columnWidths={columnWidths}
      visibleColumns={visibleColumns}
      isEmptyMessage={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.emptyMessage' })}
    />
  );
};

TransformationsList.propTypes = {
  transformations: PropTypes.arrayOf(PropTypes.object),
  allTransformations: PropTypes.arrayOf(PropTypes.object).isRequired,
};
