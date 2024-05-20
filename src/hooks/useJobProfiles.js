/* istanbul ignore file */
import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

// eslint-disable-next-line import/prefer-default-export
export const useJobProfiles = () => {
  const [namespaceKey] = useNamespace({ key: 'jobProfiles' });
  const ky = useOkapiKy();

  const { data, isFetching } = useQuery(
    {
      queryKey: [namespaceKey],
      queryFn: () => ky.get('data-export/job-profiles?used=true&limit=1000').json(),
      keepPreviousData: true,
      select: (response) => {
        return {
          jobProfiles: response?.jobProfiles.sort((jobProfileA, jobProfileB) => {
            return jobProfileA.name?.localeCompare(jobProfileB.name);
          }),
          totalRecords: response?.totalRecords,
        };
      }
    }
  );

  return {
    jobProfiles: data?.jobProfiles || [],
    totalRecords: data?.totalRecords || 0,
    isFetching
  };
};
