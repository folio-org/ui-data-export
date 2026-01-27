import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

export const useProfileUsedInLogs = (profileId, profileType, enabled = false) => {
  const [namespaceKey] = useNamespace({ key: 'profile-logs-check' });
  const ky = useOkapiKy();

  const queryField = profileType === 'job' ? 'jobProfileId' : 'mappingProfileId';

  const { data, isFetching } = useQuery(
    {
      queryKey: [namespaceKey, profileType, profileId],
      queryFn: () => ky.get(`data-export/job-executions?query=${queryField}==${profileId}&limit=1`).json(),
      enabled: Boolean(profileId) && Boolean(profileType) && enabled,
    }
  );

  return {
    isUsedInLogs: (data?.jobExecutions?.length ?? 0) > 0,
    isLoading: isFetching,
  };
};
