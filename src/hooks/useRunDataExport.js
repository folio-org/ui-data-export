import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useRunDataExport = () => {
  const ky = useOkapiKy();

  const { mutateAsync: runDataExport, isLoading: isDataExportLoading } = useMutation({
    mutationFn: async (payload) => {
      return ky.post('data-export/export', { json: payload }).json();
    },
  });

  return {
    runDataExport,
    isDataExportLoading,
  };
};
