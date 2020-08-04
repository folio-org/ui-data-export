import React, { memo } from 'react';
import PropTypes from 'prop-types';

import stripesFinalForm from '@folio/stripes/final-form';

import { TransformationField } from '../TransformationsField';

const TransformationsFormComponent = memo(({
  autosize,
  searchResults,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <TransformationField
        autosize={autosize}
        contentData={searchResults}
      />
    </form>
  );
});

TransformationsFormComponent.propTypes = {
  searchResults: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  autosize: PropTypes.bool,
};

TransformationsFormComponent.defaultProps = { autosize: false };

export const TransformationsForm = stripesFinalForm({
  subscription: { values: true },
  navigationCheck: false,
})(TransformationsFormComponent);
