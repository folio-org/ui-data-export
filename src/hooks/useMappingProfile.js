import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

export const useMappingProfile = (id, options = {}) => {
  const [namespaceKey] = useNamespace({ key: 'mappingProfile' });
  const ky = useOkapiKy();

  const { data: mappingProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: [namespaceKey, id],
    queryFn: () => ky.get(`data-export/mapping-profiles/${id}`).json(),
    enabled: !!id,
    ...options,
  });

  return {
    mappingProfile,
    isProfileLoading,
  };
};
