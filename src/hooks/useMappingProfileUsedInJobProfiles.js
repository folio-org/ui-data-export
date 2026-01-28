import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

export const useMappingProfileUsedInJobProfiles = (mappingProfileId, enabled = false) => {
  const [namespaceKey] = useNamespace({ key: 'mapping-profile-job-profiles-check' });
  const ky = useOkapiKy();

  const { data, isLoading } = useQuery(
    {
      queryKey: [namespaceKey, mappingProfileId],
      queryFn: () => ky.get(`data-export/job-profiles?query=mappingProfileId==${mappingProfileId}&limit=1000`).json(),
      enabled: Boolean(mappingProfileId) && enabled,
    }
  );

  const jobProfiles = data?.jobProfiles || [];
  const isUsedInJobProfiles = jobProfiles.length > 0;

  return {
    jobProfiles,
    isUsedInJobProfiles,
    isLoading,
  };
};

