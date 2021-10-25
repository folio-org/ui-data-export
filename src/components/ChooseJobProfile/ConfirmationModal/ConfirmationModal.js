import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import css from './ConfirmationModal.css';

const propTypes = {
  ariaLabel: PropTypes.string,
  bodyTag: PropTypes.string,
  buttonStyle: PropTypes.string,
  disabledCofirmButton: PropTypes.bool,
  cancelButtonStyle: PropTypes.string,
  cancelLabel: PropTypes.node,
  confirmLabel: PropTypes.node,
  heading: PropTypes.node.isRequired,
  id: PropTypes.string,
  message: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const defaultProps = {
  bodyTag: 'div',
  buttonStyle: 'primary',
  cancelButtonStyle: 'default',
  disabledCofirmButton: false,
};

const ConfirmationModal = props => {
  const testId = props.id || uniqueId('confirmation-');
  const cancelLabel = props.cancelLabel || <FormattedMessage id="stripes-components.cancel" />;
  const confirmLabel = props.confirmLabel || <FormattedMessage id="stripes-components.submit" />;
  const {
    bodyTag: Element,
    ...rest
  } = props;

  const footer = (
    <ModalFooter>
      <Button
        data-test-confirmation-modal-confirm-button
        buttonStyle={props.buttonStyle}
        disabled={props.disabledCofirmButton}
        id={`clickable-${testId}-confirm`}
        onClick={props.onConfirm}
      >
        {confirmLabel}
      </Button>
      <Button
        data-test-confirmation-modal-cancel-button
        buttonStyle={props.cancelButtonStyle}
        id={`clickable-${testId}-cancel`}
        onClick={props.onCancel}
      >
        {cancelLabel}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={props.open}
      id={testId}
      label={props.heading}
      aria-label={rest['aria-label'] || props.ariaLabel}
      scope="module"
      size="small"
      footer={footer}
    >
      <Element
        data-test-confirmation-modal-message
        className={css.message}
      >
        {props.message}
      </Element>
    </Modal>
  );
};

ConfirmationModal.propTypes = propTypes;
ConfirmationModal.defaultProps = defaultProps;

export default ConfirmationModal;
