import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const useJobExecutions = ({
  query = '',
  limit,
  offset,
  restQueryProps
}) => {
  const [namespaceKey] = useNamespace();
  const ky = useOkapiKy();

  const { data, isFetching } = useQuery(
    {
      queryKey: [namespaceKey, 'job-executions', limit, offset, query],
      queryFn: () => ky.get(`data-export/job-executions?query=${query}&limit=${limit}&offset=${offset}`).json(),
      keepPreviousData: true,
      ...restQueryProps
    }
  );

  return {
    jobExecutions: data?.jobExecutions || [],
    totalRecords: data?.totalRecords || 0,
    isFetching
  };
};

export default useJobExecutions;
