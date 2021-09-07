import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  match as matchShape,
  history as historyShape,
} from 'react-router-prop-types';

import {
  FileUploader,
  uploadFile,
  Preloader,
  createUrl,
} from '@folio/stripes-data-transfer-components';
import {
  Layout,
  Callout,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  useStripes,
  stripesConnect,
} from '@folio/stripes/core';

import {
  generateFileDefinitionBody,
  getFileInfo,
} from './utils';

const QueryFileUploaderComponent = props => {
  const {
    mutator,
    history,
    match,
  } = props;

  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [fileExtensionModalOpen, setFileExtensionModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const calloutRef = useRef(null);
  const currentFileUploadXhr = useRef(null);
  const stripes = useStripes();

  const uploaderTitle = isDropZoneActive ? isLoading
    ? <Preloader message={<FormattedMessage id="ui-data-export.uploading" />} />
    : <FormattedMessage id="ui-data-export.uploaderActiveTitle" />
    : <FormattedMessage id="ui-data-export.uploaderTitle" />;

  useEffect(() => {
    return () => {
      if (!currentFileUploadXhr.current) return;

      // TODO: uncomment the code below once the app is updated to stripes 3.0.0
      // which includes the fix to the tests  which allows to test cancelling of xhr requests
      // currentFileUploadXhr.current.abort();
      currentFileUploadXhr.current = null;
    };
  }, []);

  const handleDragEnter = () => {
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };

  const setDropZone = (active = true) => {
    setDropZoneActive(active);
    setLoading(active);
  };

  const showFileExtensionModal = () => {
    setFileExtensionModalOpen(true);
  };

  const hideFileExtensionModal = () => {
    setFileExtensionModalOpen(false);
  };

  async function handleDrop(acceptedFiles) {
    const { okapi } = stripes;

    const fileToUpload = acceptedFiles[0];

    if (!fileToUpload) return;

    const {
      isTypeSupported,
      fileType,
    } = getFileInfo(fileToUpload);

    if (!isTypeSupported) {
      showFileExtensionModal();

      return;
    }

    setDropZone();

    try {
      // post file upload definition with all files metadata as
      // individual file upload should have upload definition id in the URL
      const fileDefinition = await mutator.fileDefinition.POST(generateFileDefinitionBody(fileToUpload, fileType));

      currentFileUploadXhr.current = new XMLHttpRequest();

      const fileUploadResult = await uploadFile({
        xhr: currentFileUploadXhr.current,
        file: fileToUpload,
        url: createUrl(`${okapi.url}/data-export/file-definitions/${fileDefinition.id}/upload`),
        okapi,
        onFileUploadProgress: handleFileUploadProgress,
      });

      history.push({
        pathname: `${match.path}/job-profile`,
        state: { fileDefinitionId: fileUploadResult.id },
      });
    } catch (error) {
      handleUploadError();
      setDropZone(false);

      console.error(error);
    }
  }

  const handleFileUploadProgress = (file, { loaded: uploadedValue }) => {
    // TODO: handle file progress once the file uploading occurs on the choose job profile page
    console.log(uploadedValue); // eslint-disable-line no-console
  };

  const handleUploadError = () => {
    if (!calloutRef.current) return;

    calloutRef.current.sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-data-export.communicationProblem" />,
    });
  };

  return (
    <>
      <FileUploader
        multiple={false}
        title={uploaderTitle}
        uploadButtonText={<FormattedMessage id="ui-data-export.uploaderBtnText" />}
        isDropZoneActive={isDropZoneActive}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {openDialogWindow => (
          <>
            <Layout className="padding-top-gutter padding-start-gutter padding-end-gutter textCentered">
              <span data-test-sub-title>
                <FormattedMessage id="ui-data-export.uploaderSubTitle" />
              </span>
            </Layout>
            <ConfirmationModal
              id="file-extension-modal"
              open={fileExtensionModalOpen}
              heading={(
                <span data-test-file-extension-modal-header>
                  <FormattedMessage id="ui-data-export.modal.fileExtensions.blocked.header" />
                </span>
              )}
              message={<FormattedMessage id="ui-data-export.modal.fileExtensions.blocked.message" />}
              confirmLabel={<FormattedMessage id="ui-data-export.modal.fileExtensions.actionButton" />}
              cancelLabel={<FormattedMessage id="ui-data-export.cancel" />}
              onConfirm={() => {
                hideFileExtensionModal();
                openDialogWindow();
              }}
              onCancel={hideFileExtensionModal}
            />
          </>
        )}
      </FileUploader>
      <Callout ref={calloutRef} />
    </>
  );
};

QueryFileUploaderComponent.propTypes = {
  history: historyShape.isRequired,
  match: matchShape.isRequired,
  mutator: PropTypes.shape({ fileDefinition: PropTypes.shape({ POST: PropTypes.func.isRequired }).isRequired }).isRequired,
};

QueryFileUploaderComponent.manifest = Object.freeze({
  fileDefinition: {
    type: 'okapi',
    path: 'data-export/file-definitions',
    throwErrors: false,
    fetch: false,
  },
});

export const QueryFileUploader = stripesConnect(withRouter(QueryFileUploaderComponent));
