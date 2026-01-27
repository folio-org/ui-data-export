import { renderHook } from '@testing-library/react-hooks';

import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { useMappingProfileUsedInJobProfiles } from './useMappingProfileUsedInJobProfiles';

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
  useOkapiKy: jest.fn(),
}));

describe('useMappingProfileUsedInJobProfiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useNamespace.mockReturnValue(['mapping-profile-job-profiles-check']);
    useOkapiKy.mockReturnValue({
      get: jest.fn(() => ({
        json: jest.fn(),
      })),
    });

    useQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
  });

  it('should return not used when there is no data', () => {
    const { result } = renderHook(() => useMappingProfileUsedInJobProfiles('mp-id', true));

    expect(result.current).toEqual({
      jobProfiles: [],
      isUsedInJobProfiles: false,
      isLoading: false,
    });
  });

  it('should calculate isUsedInJobProfiles based on received jobProfiles', () => {
    useQuery.mockReturnValue({
      data: {
        jobProfiles: [{ name: 'JP 1' }],
      },
      isLoading: false,
    });

    const { result } = renderHook(() => useMappingProfileUsedInJobProfiles('mp-id', true));

    expect(result.current.jobProfiles).toEqual([{ name: 'JP 1' }]);
    expect(result.current.isUsedInJobProfiles).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should pass enabled=false to useQuery when enabled flag is false', () => {
    renderHook(() => useMappingProfileUsedInJobProfiles('mp-id', false));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
      enabled: false,
    }));
  });

  it('should pass enabled=false to useQuery when mappingProfileId is falsy', () => {
    renderHook(() => useMappingProfileUsedInJobProfiles(undefined, true));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
      enabled: false,
    }));
  });

  it('should build correct queryKey and queryFn', async () => {
    const kyGet = jest.fn(() => ({
      json: jest.fn().mockResolvedValue({ jobProfiles: [] }),
    }));

    useOkapiKy.mockReturnValue({
      get: kyGet,
    });

    let capturedOptions;

    useQuery.mockImplementation((options) => {
      capturedOptions = options;

      return {
        data: undefined,
        isLoading: false,
      };
    });

    renderHook(() => useMappingProfileUsedInJobProfiles('mp-id', true));

    expect(capturedOptions.queryKey).toEqual(['mapping-profile-job-profiles-check', 'mp-id']);

    await capturedOptions.queryFn();

    expect(kyGet).toHaveBeenCalledWith('data-export/job-profiles?query=mappingProfileId==mp-id&limit=1000');
  });
});
