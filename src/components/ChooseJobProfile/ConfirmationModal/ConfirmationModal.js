import React, { useEffect, useRef } from 'react';
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


const ConfirmationModal = props => {
  const {
    bodyTag: Element = 'div',
    buttonStyle = 'primary',
    cancelButtonStyle = 'default',
    disabledCofirmButton = false,
    id = uniqueId('confirmation-'),
    cancelLabel = <FormattedMessage id="stripes-components.cancel" />,
    confirmLabel = <FormattedMessage id="stripes-components.submit" />,
    onConfirm,
    onCancel,
    open,
    heading,
    ariaLabel,
    message,
    ...rest
  } = props;

  const confirmButtonRef = useRef(null);

  useEffect(() => {
    // when the confirm button becomes enabled, move focus to it
    if (!disabledCofirmButton && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [disabledCofirmButton]);

  const footer = (
    <ModalFooter>
      <Button
        ref={confirmButtonRef}
        data-test-confirmation-modal-confirm-button
        buttonStyle={buttonStyle}
        disabled={disabledCofirmButton}
        id={`clickable-${id}-confirm`}
        onClick={onConfirm}
      >
        {confirmLabel}
      </Button>
      <Button
        data-test-confirmation-modal-cancel-button
        buttonStyle={cancelButtonStyle}
        id={`clickable-${id}-cancel`}
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={open}
      id={id}
      label={heading}
      aria-label={rest['aria-label'] || ariaLabel}
      scope="module"
      size="small"
      footer={footer}
    >
      <Element
        data-test-confirmation-modal-message
        className={css.message}
      >
        {message}
      </Element>
    </Modal>
  );
};

ConfirmationModal.propTypes = propTypes;

export default ConfirmationModal;
