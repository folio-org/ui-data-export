import React, { useContext } from 'react';

import { FormattedMessage } from 'react-intl';
import { CalloutContext } from '../../contexts/CalloutContext';

export const useProfileHandlerWithCallout = ({
  errorMessageId,
  successMessageId,
  onActionComplete,
  onAction,
  isCanceledAfterError = false,
}) => {
  const callout = useContext(CalloutContext);

  return async values => {
    try {
      await onAction(values);

      callout.sendCallout({
        message: <FormattedMessage
          id={successMessageId}
          values={{ name: values.name }}
        />,
      });

      onActionComplete();
    } catch {
      callout.sendCallout({
        message: <FormattedMessage
          id={errorMessageId}
          values={{ name: values.name }}
        />,
        type: 'error',
      });

      if (isCanceledAfterError) {
        onActionComplete();
      }
    }
  };
};
