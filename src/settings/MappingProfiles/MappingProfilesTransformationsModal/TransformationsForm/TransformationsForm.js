import React, {
  memo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { intersectionWith } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';

import { TransformationField } from '../TransformationsField';

import css from './TransformationsForm.css';

const TransformationsFormComponent = memo(({
  autosize,
  searchResults,
  handleSubmit,
}) => {
  const prepareData = useCallback(
    results => intersectionWith(results, searchResults, (val1, val2) => val1.path === val2.path),
    [searchResults],
  );

  return (
    <form
      className={css.transformationsForm}
      onSubmit={handleSubmit}
    >
      <TransformationField
        autosize={autosize}
        prepareData={prepareData}
      />
    </form>
  );
});

TransformationsFormComponent.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  autosize: PropTypes.bool,
};

TransformationsFormComponent.defaultProps = { autosize: false };

export const TransformationsForm = stripesFinalForm({
  subscription: { values: true },
  navigationCheck: false,
})(TransformationsFormComponent);
