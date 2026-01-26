import { renderHook } from '@testing-library/react-hooks';

import * as stripesCore from '@folio/stripes/core';
import * as reactQuery from 'react-query';
import { useProfileUsedInLogs } from './useProfileUsedInLogs';

jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
  useOkapiKy: jest.fn(),
}), { virtual: true });

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

const mockUseNamespace = stripesCore.useNamespace;
const mockUseOkapiKy = stripesCore.useOkapiKy;
const mockUseQuery = reactQuery.useQuery;

describe('useProfileUsedInLogs', () => {
  const kyGetMock = jest.fn();
  const kyJsonMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseNamespace.mockReturnValue(['test-namespace']);

    kyGetMock.mockReturnValue({ json: kyJsonMock });
    mockUseOkapiKy.mockReturnValue({ get: kyGetMock });

    mockUseQuery.mockImplementation((config) => ({
      data: { jobExecutions: [] },
      isFetching: false,
      ...config.__overrideReturn,
    }));
  });

  it('calls useNamespace with correct key', () => {
    renderHook(() => useProfileUsedInLogs('123', 'job', true));

    expect(mockUseNamespace).toHaveBeenCalledWith({ key: 'profile-logs-check' });
  });

  it('calls useQuery with correct queryKey for job profile', () => {
    renderHook(() => useProfileUsedInLogs('123', 'job', true));

    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    const callArg = mockUseQuery.mock.calls[0][0];

    expect(callArg.queryKey).toEqual(['test-namespace', 'job', '123']);
    expect(callArg.enabled).toBe(true);
  });

  it('calls useQuery with correct queryKey for mapping profile', () => {
    renderHook(() => useProfileUsedInLogs('456', 'mapping', true));

    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    const callArg = mockUseQuery.mock.calls[0][0];

    expect(callArg.queryKey).toEqual(['test-namespace', 'mapping', '456']);
    expect(callArg.enabled).toBe(true);
  });

  it('builds correct queryFn for job profile using jobProfileId', async () => {
    const profileId = '123';
    const mockResponse = { jobExecutions: [{ id: 'exec-1' }] };

    kyJsonMock.mockResolvedValueOnce(mockResponse);

    let capturedQueryFn;
    mockUseQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return { data: mockResponse, isFetching: false };
    });

    renderHook(() => useProfileUsedInLogs(profileId, 'job', true));

    expect(capturedQueryFn).toBeDefined();

    const result = await capturedQueryFn();

    expect(kyGetMock).toHaveBeenCalledWith(`data-export/job-executions?query=jobProfileId==${profileId}&limit=1`);
    expect(kyJsonMock).toHaveBeenCalled();
    expect(result).toBe(mockResponse);
  });

  it('builds correct queryFn for mapping profile using mappingProfileId', async () => {
    const profileId = '456';
    const mockResponse = { jobExecutions: [] };

    kyJsonMock.mockResolvedValueOnce(mockResponse);

    let capturedQueryFn;
    mockUseQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return { data: mockResponse, isFetching: false };
    });

    renderHook(() => useProfileUsedInLogs(profileId, 'mapping', true));

    expect(capturedQueryFn).toBeDefined();

    const result = await capturedQueryFn();

    expect(kyGetMock).toHaveBeenCalledWith(`data-export/job-executions?query=mappingProfileId==${profileId}&limit=1`);
    expect(kyJsonMock).toHaveBeenCalled();
    expect(result).toBe(mockResponse);
  });

  it('disables query when profileId is falsy', () => {
    renderHook(() => useProfileUsedInLogs(null, 'job', true));

    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    const callArg = mockUseQuery.mock.calls[0][0];

    expect(callArg.enabled).toBe(false);
  });

  it('disables query when profileType is falsy', () => {
    renderHook(() => useProfileUsedInLogs('123', null, true));

    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    const callArg = mockUseQuery.mock.calls[0][0];

    expect(callArg.enabled).toBe(false);
  });

  it('disables query when enabled is false', () => {
    renderHook(() => useProfileUsedInLogs('123', 'job', false));

    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    const callArg = mockUseQuery.mock.calls[0][0];

    expect(callArg.enabled).toBe(false);
  });

  it('returns isUsedInLogs as true when jobExecutions exist', () => {
    mockUseQuery.mockImplementation(() => ({
      data: { jobExecutions: [{ id: 'exec-1' }] },
      isFetching: false,
    }));

    const { result } = renderHook(() => useProfileUsedInLogs('123', 'job', true));

    expect(result.current.isUsedInLogs).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns isUsedInLogs as false when jobExecutions is empty', () => {
    mockUseQuery.mockImplementation(() => ({
      data: { jobExecutions: [] },
      isFetching: false,
    }));

    const { result } = renderHook(() => useProfileUsedInLogs('123', 'job', true));

    expect(result.current.isUsedInLogs).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns isUsedInLogs as false when data is undefined', () => {
    mockUseQuery.mockImplementation(() => ({
      data: undefined,
      isFetching: false,
    }));

    const { result } = renderHook(() => useProfileUsedInLogs('123', 'job', true));

    expect(result.current.isUsedInLogs).toBe(false);
  });

  it('returns isLoading from isFetching', () => {
    mockUseQuery.mockImplementation(() => ({
      data: { jobExecutions: [] },
      isFetching: true,
    }));

    const { result } = renderHook(() => useProfileUsedInLogs('123', 'job', true));

    expect(result.current.isLoading).toBe(true);
  });
});
