export const downloadFileByLink = (fileName, downloadLink) => {
  if (!fileName || !downloadLink) return;

  const elem = window.document.createElement('a');

  elem.href = downloadLink;
  elem.download = fileName;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
};
