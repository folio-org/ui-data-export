import React from 'react';
import PropTypes from 'prop-types';

import stripesFinalForm from '@folio/stripes/final-form';

import { TransformationField } from '../TransformationsField';

import css from './TransformationsForm.css';

const TransformationsFormComponent = ({
  autosize,
  handleSubmit,
}) => {
  return (
    <form
      className={css.transformationsForm}
      onSubmit={handleSubmit}
    >
      <TransformationField autosize={autosize} />
    </form>
  );
};

TransformationsFormComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  autosize: PropTypes.bool,
};

TransformationsFormComponent.defaultProps = { autosize: false };

export const TransformationsForm = stripesFinalForm({
  subscription: { values: true },
  navigationCheck: false,
})(TransformationsFormComponent);
