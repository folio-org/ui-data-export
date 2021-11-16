import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';
import { InfoPopover } from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

export const RECORD_TYPES = [
  {
    value: FOLIO_RECORD_TYPES.SRS.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.SRS.captionId} />,
    details: (
      <InfoPopover
        content={<SafeHTMLMessage id="ui-data-export.mappingProfiles.srs.info" />}
        iconSize="medium"
      />
    ),
  },
  {
    value: FOLIO_RECORD_TYPES.INSTANCE.type,
    label: <FormattedMessage id="ui-data-export.mappingProfiles.recordType.instance" />,
  },
  {
    value: FOLIO_RECORD_TYPES.HOLDINGS.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.HOLDINGS.captionId} />,
  },
  {
    value: FOLIO_RECORD_TYPES.ITEM.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.ITEM.captionId} />,
  },
];
