import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

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
} from '@folio/stripes-core';

import {
  generateFileDefinitionBody,
  checkFileHaveCsvExtension,
} from './utils';

import css from './QueryFileUploader.css';

const QueryFileUploaderComponent = props => {
  const { mutator } = props;

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

    const haveCsvExtension = checkFileHaveCsvExtension(fileToUpload);

    if (!haveCsvExtension) {
      showFileExtensionModal();

      return;
    }

    setDropZone();

    try {
      // post file upload definition with all files metadata as
      // individual file upload should have upload definition id in the URL
      const fileDefinition = await mutator.fileDefinition.POST(generateFileDefinitionBody(fileToUpload));

      currentFileUploadXhr.current = new XMLHttpRequest();

      const fileUploadResult = await uploadFile({
        xhr: currentFileUploadXhr.current,
        file: fileToUpload,
        url: createUrl(`${okapi.url}/data-export/fileDefinitions/${fileDefinition.id}/upload`),
        okapi,
        onFileUploadProgress: handleFileUploadProgress,
      });

      // TODO: replace jobProfileId with real one once backend is implemented
      await mutator.export.POST({
        fileDefinitionId: fileUploadResult.id,
        jobProfileId: '6f7f3cd7-9f24-42eb-ae91-91af1cd54d0a',
      });

      setDropZone(false);
    } catch (error) {
      handleUploadError();
      setDropZone(false);

      console.error(error); // eslint-disable-line no-console
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
      message: <FormattedMessage id="ui-data-import.communicationProblem" />,
    });
  };

  return (
    <>
      <FileUploader
        multiple={false}
        title={uploaderTitle}
        uploadButtonText={<FormattedMessage id="ui-data-export.uploaderBtnText" />}
        isDropZoneActive={isDropZoneActive}
        className={css.upload}
        activeClassName={css.activeUpload}
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
  mutator: PropTypes.shape({
    fileDefinition: PropTypes.shape({ POST: PropTypes.func.isRequired }).isRequired,
    export: PropTypes.shape({ POST: PropTypes.func.isRequired }).isRequired,
  }).isRequired,
};

QueryFileUploaderComponent.manifest = Object.freeze({
  fileDefinition: {
    type: 'okapi',
    path: 'data-export/fileDefinitions',
    throwErrors: false,
    fetch: false,
  },
  export: {
    type: 'okapi',
    path: 'data-export/export',
    clientGeneratePk: false,
    throwErrors: false,
    fetch: false,
  },
});

export const QueryFileUploader = stripesConnect(QueryFileUploaderComponent);
