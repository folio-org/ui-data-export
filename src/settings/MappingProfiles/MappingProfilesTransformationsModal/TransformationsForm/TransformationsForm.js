import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';

import { TransformationField } from '../TransformationsField';

const TransformationsFormComponent = memo(({
  searchResults,
  form,
  isSelectAllChecked,
  handleSubmit,
  onSelectChange,
}) => {
  const handleSelectChange = () => {
    const transformations = get(form.getState(), 'values.transformations', []);
    const selectedTransformations = transformations.reduce((result, transformation) => {
      if (transformation?.isSelected) {
        result[transformation.order] = true;
      }

      return result;
    }, {});

    onSelectChange(selectedTransformations);
  };

  const handleSelectAll = () => {
    searchResults.forEach(transformation => {
      const fieldState = form.getFieldState(`transformations[${transformation.order}].isSelected`);

      if (Boolean(fieldState.value) === isSelectAllChecked) {
        fieldState.change(!isSelectAllChecked);
      }
    });

    handleSelectChange();
  };

  return (
    <form onSubmit={handleSubmit}>
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
  handleSubmit: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
};

TransformationsFormComponent.defaultProps = { isSelectAllChecked: false };

export const TransformationsForm = stripesFinalForm({
  subscription: { values: true },
  navigationCheck: false,
})(TransformationsFormComponent);
