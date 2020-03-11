import { createOkapiHeaders } from '@folio/stripes-data-transfer-components';

export const getFileDownloadLinkRequest = async (jobLog, okapi) => {
  const url = `/data-export/jobExecutions/${jobLog.id}/download/${jobLog.exportedFiles[0].fileId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: createOkapiHeaders(okapi),
  });

  if (!response.ok) {
    throw response;
  }

  const { link } = await response.json();

  return link;
};
