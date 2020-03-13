import { isTestEnv } from './isTestEnv';

export const downloadFileByLink = (fileName, downloadLink) => {
  if (!fileName || !downloadLink) return;

  const elem = window.document.createElement('a');

  elem.href = downloadLink;
  elem.download = fileName;
  elem.style.display = 'none';
  document.body.appendChild(elem);

  if (!isTestEnv()) elem.click();

  document.body.removeChild(elem);
};
