import React, {
  memo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';

import { TransformationField } from '../TransformationsField';

import css from './TransformationsForm.css';

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
    const selectedTransformations = transformations.reduce((result, transformation) => {
      if (transformation?.isSelected) {
        result[transformation.order] = true;
      }

      return result;
    }, {});

    onSelectChange(selectedTransformations);
  }, [getFormState, onSelectChange]);

  const handleSelectAll = useCallback(() => {
    searchResults.forEach(transformation => {
      changeFormField(`transformations[${transformation.order}].isSelected`, !isSelectAllChecked);
    });

    handleSelectChange();
  }, [searchResults, isSelectAllChecked, handleSelectChange, changeFormField]);

  return (
    <form className={css.form}>
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
