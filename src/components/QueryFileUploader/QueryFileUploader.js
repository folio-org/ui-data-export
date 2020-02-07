import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import { FileUploader } from '@folio/stripes-data-transfer-components';
import { Layout } from '@folio/stripes-components';

import css from './QueryFileUploader.css';

export function QueryFileUploader() {
  const [isDropZoneActive, setDropZoneActive] = useState(false);

  const uploaderTitle = isDropZoneActive ?
    <FormattedMessage id="ui-data-export.uploaderActiveTitle" /> :
    <FormattedMessage id="ui-data-export.uploaderTitle" />;

  function onDragEnter() {
    setDropZoneActive(true);
  }

  function onDragLeave() {
    setDropZoneActive(false);
  }

  return (
    <FileUploader
      multiple={false}
      title={uploaderTitle}
      uploadButtonText={<FormattedMessage id="ui-data-export.uploaderBtnText" />}
      isDropZoneActive={isDropZoneActive}
      className={css.upload}
      activeClassName={css.activeUpload}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={noop}
    >
      <Layout className="padding-top-gutter padding-start-gutter padding-end-gutter textCentered">
        <span data-test-sub-title>
          <FormattedMessage id="ui-data-export.uploaderSubTitle" />
        </span>
      </Layout>
    </FileUploader>
  );
}
