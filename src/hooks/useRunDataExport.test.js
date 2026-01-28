import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: jest.fn(),
}), { virtual: true });

jest.mock('react-query', () => ({
  useMutation: jest.fn(),
}));

let useRunDataExport;
let mockUseOkapiKy;
let mockUseMutation;

describe('useRunDataExport', () => {
  const kyPostMock = jest.fn();
  const kyJsonMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    ({ useRunDataExport } = await import('./useRunDataExport'));
    ({ useOkapiKy: mockUseOkapiKy } = await import('@folio/stripes/core'));
    ({ useMutation: mockUseMutation } = await import('react-query'));

    kyPostMock.mockReturnValue({ json: kyJsonMock });
    mockUseOkapiKy.mockReturnValue({ post: kyPostMock });

    mockUseMutation.mockImplementation((config) => ({
      mutateAsync: jest.fn(config.mutationFn),
      isLoading: false,
      ...config.__overrideReturn,
    }));
  });

  it('calls useOkapiKy to get ky client', () => {
    renderHook(() => useRunDataExport());

    expect(mockUseOkapiKy).toHaveBeenCalled();
  });

  it('passes correct mutationFn to useMutation', async () => {
    const mockResponse = { jobId: '12345' };
    kyJsonMock.mockResolvedValueOnce(mockResponse);

    let capturedMutationFn;

    mockUseMutation.mockImplementation((config) => {
      capturedMutationFn = config.mutationFn;
      return { mutateAsync: capturedMutationFn, isLoading: false };
    });

    renderHook(() => useRunDataExport());

    const payload = { exportType: 'MARC' };
    const result = await capturedMutationFn(payload);

    expect(kyPostMock).toHaveBeenCalledWith('data-export/export', { json: payload });
    expect(kyJsonMock).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('returns runDataExport and isDataExportLoading', () => {
    const mockMutateAsync = jest.fn();
    mockUseMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isLoading: true,
    });

    const { result } = renderHook(() => useRunDataExport());

    expect(result.current.runDataExport).toBe(mockMutateAsync);
    expect(result.current.isDataExportLoading).toBe(true);
  });

  it('runDataExport calls mutateAsync with correct payload', async () => {
    const mockMutateAsync = jest.fn();
    mockUseMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isLoading: false,
    });

    const { result } = renderHook(() => useRunDataExport());

    const payload = { foo: 'bar' };

    await act(async () => {
      await result.current.runDataExport(payload);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith(payload);
  });
});
