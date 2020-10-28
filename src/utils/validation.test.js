import {
  required,
  requiredArray,
} from './validation';

describe('generateFileDefinitionBody', () => {
  it('should validate correct simple values', () => {
    expect(required(10)).toBeUndefined();
    expect(required(false)).toBeUndefined();
    expect(required(0)).toBeUndefined();
    expect(required(null)).not.toBeUndefined();
  });

  it('should validate correct array values', () => {
    expect(requiredArray(null)).not.toBeUndefined();
    expect(requiredArray([])).not.toBeUndefined();
    expect(requiredArray([1])).toBeUndefined();
  });
});
