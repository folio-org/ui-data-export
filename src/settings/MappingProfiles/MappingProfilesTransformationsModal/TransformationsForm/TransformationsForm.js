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
  validatedTransformations = {},
  isSelectAllChecked = false,
  stateRef,
  setValidatedTransformations,
  setIsSubmitButtonDisabled,
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
        validatedTransformations={validatedTransformations}
        isSelectAllChecked={isSelectAllChecked}
        setValidatedTransformations={setValidatedTransformations}
        setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
        onSelectChange={handleSelectChange}
        onSelectAll={handleSelectAll}
      />
    </form>
  );
});

TransformationsFormComponent.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  validatedTransformations: PropTypes.objectOf(PropTypes.shape({
    marcField: PropTypes.bool,
    indicator1: PropTypes.bool,
    indicator2: PropTypes.bool,
    subfield: PropTypes.bool,
  })),
  isSelectAllChecked: PropTypes.bool,
  form: PropTypes.object.isRequired,
  stateRef: PropTypes.object,
  setValidatedTransformations: PropTypes.func.isRequired,
  setIsSubmitButtonDisabled: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
};

export const TransformationsForm = stripesFinalForm({
  subscription: { values: false },
  navigationCheck: false,
})(TransformationsFormComponent);
