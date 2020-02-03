import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import { FileUploader } from '@folio/stripes-data-transfer-components';
import { Layout } from '@folio/stripes-components';

import css from './ImportRecords.css';

export function ImportRecords() {
  const [isDropZoneActive, setDropZoneActive] = useState(false);

  function onDragEnter() {
    setDropZoneActive(true);
  }

  function onDragLeave() {
    setDropZoneActive(false);
  }

  return (
    <FileUploader
      multiple={false}
      title={<FormattedMessage id="ui-data-export.uploadTitle" />}
      uploadButtonText={<FormattedMessage id="ui-data-export.uploadBtnText" />}
      isDropZoneActive={isDropZoneActive}
      className={css.upload}
      activeClassName={css.activeUpload}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={noop}
    >
      <Layout className="padding-top-gutter padding-start-gutter padding-end-gutter textCentered">
        <FormattedMessage id="ui-data-export.uploadSubTitle" />
      </Layout>
    </FileUploader>
  );
}
