import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

// eslint-disable-next-line import/prefer-default-export
export const useUsers = () => {
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
          relatedUsers: response?.relatedUsers.map(item => {
            return {
              userId: item.userId,
              firstName: item.firstName,
              lastName: item.lastName,
            };
          })
            .sort((userA, userB) => {
              const nameA = userA.firstName || userA.lastName;
              const nameB = userB.firstName || userB.lastName;

              if (userA.firstName?.localeCompare(userB.firstName) === 0) {
                return userA.lastName.localeCompare(userB.lastName);
              }

              return nameA.localeCompare(nameB);
            }),
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
