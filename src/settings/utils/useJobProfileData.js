import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useProfileHandlerWithCallout } from './useProfileHandlerWithCallout';

export const useJobProfileData = ({
  onSubmit, onCancel, match, errorMessageId, successMessageId,
}) => {
  const ky = useOkapiKy();

  const { data: jobProfileRecord } = useQuery(
    ['data-export', 'job-profile', match.params.id],
    () => ky(`data-export/job-profiles/${match.params.id}`).json()
  );

  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId,
    successMessageId,
    onAction: onSubmit,
    onActionComplete: onCancel,
    isCanceledAfterError: true,
  });

  return {
    jobProfileRecord,
    handleSubmit,
  };
};
