import {
  fieldSuppression,
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

  it('should validate correct fieldSuppression values', () => {
    // invalid
    expect(fieldSuppression('1111')).not.toBeUndefined();
    expect(fieldSuppression('Ass...e,')).not.toBeUndefined();
    expect(fieldSuppression('e  ,b ,a')).not.toBeUndefined();
    expect(fieldSuppression('abc')).not.toBeUndefined();

    // valid
    expect(fieldSuppression('')).toBeUndefined();
    expect(fieldSuppression(null)).toBeUndefined();
    expect(fieldSuppression('999')).toBeUndefined();
    expect(fieldSuppression('111,222')).toBeUndefined();
    expect(fieldSuppression('111,     222')).toBeUndefined();
    expect(fieldSuppression('   111,     222   ,333')).toBeUndefined();
  });
});
