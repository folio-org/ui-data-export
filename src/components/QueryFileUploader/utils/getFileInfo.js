import { getFileExtension } from '@folio/stripes-data-transfer-components';
import { SUPPORTED_FILE_EXTENSIONS } from '../../../utils/constants';

export const getFileInfo = file => {
  const fileType = getFileExtension(file).substring(1);

  return {
    isTypeSupported: Boolean(SUPPORTED_FILE_EXTENSIONS[fileType.toUpperCase()]),
    fileType,
  };
};