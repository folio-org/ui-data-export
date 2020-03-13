import { createOkapiHeaders } from '@folio/stripes-data-transfer-components';

export default async (jobLog, okapi) => {
  const { url: host } = okapi;
  const url = `${host}/data-export/jobExecutions/${jobLog.id}/download/${jobLog.exportedFiles[0].fileId}`;
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
