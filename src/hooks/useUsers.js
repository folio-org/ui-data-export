import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { getSortedUsers } from '../utils';

const useUsers = () => {
  const [namespaceKey] = useNamespace({ key: 'relatedUsers' });
  const ky = useOkapiKy();

  const { data, isFetching } = useQuery(
    {
      queryKey: [namespaceKey],
      queryFn: () => ky.get('data-export/related-users?limit=100').json(),
      keepPreviousData: true,
      select: (response) => {
        return {
          totalRecords: response?.totalRecords,
          relatedUsers: getSortedUsers(response?.relatedUsers),
        };
      }
    }
  );

  return {
    relatedUsers: data?.relatedUsers || [],
    totalRecords: data?.totalRecords || 0,
    isFetching
  };
};

export default useUsers;
