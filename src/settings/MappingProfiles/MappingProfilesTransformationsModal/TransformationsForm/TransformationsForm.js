import React, {
  memo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';

import {
  generateSelectedTransformations,
  TransformationField,
} from '../TransformationsField';

import commonCss from '../../../../common/common.css';

const TransformationsFormComponent = memo(({
  searchResults,
  form,
  isSelectAllChecked,
  stateRef,
  onSelectChange,
}) => {
  stateRef.current = form;

  const {
    change: changeFormField,
    getState: getFormState,
  } = form;

  const handleSelectChange = useCallback(() => {
    const transformations = get(getFormState(), 'values.transformations', []);
    const selectedTransformations = generateSelectedTransformations(
      transformations,
      transformation => transformation.isSelected && transformation
    );

    onSelectChange(selectedTransformations);
  }, [getFormState, onSelectChange]);

  const handleSelectAll = useCallback(() => {
    searchResults.forEach(transformation => {
      changeFormField(`transformations[${transformation.order}].isSelected`, !isSelectAllChecked);
    });

    handleSelectChange();
  }, [searchResults, isSelectAllChecked, handleSelectChange, changeFormField]);

  return (
    <form className={commonCss.fullScreen}>
      <TransformationField
        contentData={searchResults}
        isSelectAllChecked={isSelectAllChecked}
        onSelectChange={handleSelectChange}
        onSelectAll={handleSelectAll}
      />
    </form>
  );
});

TransformationsFormComponent.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSelectAllChecked: PropTypes.bool,
  form: PropTypes.object.isRequired,
  stateRef: PropTypes.object,
  onSelectChange: PropTypes.func.isRequired,
};

TransformationsFormComponent.defaultProps = { isSelectAllChecked: false };

export const TransformationsForm = stripesFinalForm({
  subscription: { values: false },
  navigationCheck: false,
})(TransformationsFormComponent);
