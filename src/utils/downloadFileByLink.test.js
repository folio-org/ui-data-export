import { downloadFileByLink } from './downloadFileByLink';

jest.mock('./isTestEnv', () => ({
  isTestEnv: () => false,
}))

describe('downloadFileByLink', () => {
  it('should create element and remove', () => {
    const createElementSpy = jest.spyOn(window.document, 'createElement');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    downloadFileByLink('fileName', 'downloadLink');

    expect(createElementSpy).toBeCalled();
    expect(removeChildSpy).toBeCalled();
  });
});
