import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { orderBy } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';

const columnWidths = {
  fieldName: '50%',
  field: '15%',
  ind1: '10%',
  ind2: '10%',
  subfield: '15%',
};
const visibleColumns = ['fieldName', 'field', 'ind1', 'ind2', 'subfield'];
const getValue = (record, index) => {
  const isFourthCharEmpty = !record.transformation[index] || record.transformation[index].trim() === '';
  const startsWithZero = record.transformation.startsWith('0');

  if (isFourthCharEmpty) {
    return startsWithZero ? '' : '\\';
  } else {
    return record.transformation[index];
  }
};

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
    field: record => {
      return record.transformation.slice(0, 3);
    },
    ind1: record => {
      return getValue(record, 3);
    },
    ind2: record => {
      return getValue(record, 4);
    },
    subfield: record => {
      return record.transformation[6];
    },
  }), [allTransformations]);

  const columnMapping = useMemo(() => ({
    fieldName: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.fieldName' }),
    field: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.field' }),
    ind1: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.ind1' }),
    ind2: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.ind2' }),
    subfield: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.subfield' }),
  }), [intl]);

  useEffect(() => {
    const formattedTransformations = orderBy(transformations.map(transformation => ({
      fieldName: formatter.fieldName(transformation),
      field: formatter.field(transformation),
      subfield: formatter.subfield(transformation),
      ind1: formatter.ind1(transformation),
      ind2: formatter.ind2(transformation),
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
