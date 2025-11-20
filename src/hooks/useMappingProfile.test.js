import { renderHook } from '@testing-library/react-hooks';
import { useMappingProfile } from './useMappingProfile';

jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
  useOkapiKy: jest.fn(),
}));

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

const mockUseNamespace = require('@folio/stripes/core').useNamespace;
const mockUseOkapiKy = require('@folio/stripes/core').useOkapiKy;
const mockUseQuery = require('react-query').useQuery;

describe('useMappingProfile', () => {
  const kyGetMock = jest.fn();
  const kyJsonMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseNamespace.mockReturnValue(['test-namespace']);

    kyGetMock.mockReturnValue({ json: kyJsonMock });
    mockUseOkapiKy.mockReturnValue({ get: kyGetMock });

    mockUseQuery.mockImplementation((config) => ({
      data: 'mock-profile',
      isLoading: false,
      ...config.__overrideReturn, // allow per-test overrides
    }));
  });

  it('calls useNamespace with correct key', () => {
    renderHook(() => useMappingProfile('123'));

    expect(mockUseNamespace).toHaveBeenCalledWith({ key: 'mappingProfile' });
  });

  it('calls useQuery with correct queryKey and enabled when id is provided', () => {
    renderHook(() => useMappingProfile('123'));

    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    const callArg = mockUseQuery.mock.calls[0][0];

    expect(callArg.queryKey).toEqual(['test-namespace', '123']);
    expect(callArg.enabled).toBe(true);
    expect(typeof callArg.queryFn).toBe('function');
  });

  it('builds correct queryFn using ky client', async () => {
    const id = '123';
    const mockProfile = { id: '123', name: 'Test profile' };

    kyJsonMock.mockResolvedValueOnce(mockProfile);

    let capturedQueryFn;
    mockUseQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return { data: mockProfile, isLoading: false };
    });

    renderHook(() => useMappingProfile(id));

    expect(capturedQueryFn).toBeDefined();

    const result = await capturedQueryFn();

    expect(kyGetMock).toHaveBeenCalledWith(`data-export/mapping-profiles/${id}`);
    expect(kyJsonMock).toHaveBeenCalled();
    expect(result).toBe(mockProfile);
  });

  it('disables query when id is falsy', () => {
    renderHook(() => useMappingProfile(null));

    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    const callArg = mockUseQuery.mock.calls[0][0];

    expect(callArg.queryKey).toEqual(['test-namespace', null]);
    expect(callArg.enabled).toBe(false);
  });

  it('returns mappingProfile and isProfileLoading from useQuery', () => {
    mockUseQuery.mockImplementation(() => ({
      data: { id: '123' },
      isLoading: true,
    }));

    const { result } = renderHook(() => useMappingProfile('123'));

    expect(result.current.mappingProfile).toEqual({ id: '123' });
    expect(result.current.isProfileLoading).toBe(true);
  });

  it('allows options to override defaults (e.g. enabled)', () => {
    const options = { enabled: false, staleTime: 5000 };

    renderHook(() => useMappingProfile('123', options));

    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    const callArg = mockUseQuery.mock.calls[0][0];

    expect(callArg.enabled).toBe(false);
    expect(callArg.staleTime).toBe(5000);
  });
});
