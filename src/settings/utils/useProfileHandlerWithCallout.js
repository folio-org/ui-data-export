import React, { useContext } from 'react';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { CalloutContext } from '@folio/stripes/core';

export const useProfileHandlerWithCallout = ({
  errorMessageId,
  successMessageId,
  onCancel,
  onAction,
  isCanceledAfterError = false,
}) => {
  const callout = useContext(CalloutContext);

  return async values => {
    try {
      await onAction(values);

      callout.sendCallout({
        message: <SafeHTMLMessage
          id={successMessageId}
          values={{ name: values.name }}
        />,
      });

      onCancel();
    } catch {
      callout.sendCallout({
        message: <SafeHTMLMessage
          id={errorMessageId}
          values={{ name: values.name }}
        />,
        type: 'error',
      });

      if (isCanceledAfterError) {
        onCancel();
      }
    }
  };
};
