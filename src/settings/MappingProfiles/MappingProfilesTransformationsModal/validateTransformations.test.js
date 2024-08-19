import '../../../../test/jest/__mock__';

import {
  validateTransformations,
  validateRawTransformation,
  isRawTransformationEmpty,
  isInstanceTransformationEmpty,
  checkTransformationValidity,
} from './validateTransformations';

describe('validateRawTransformation', () => {
  const validTransformation = {
    marcField: true,
    indicator1: true,
    indicator2: true,
    subfield: true,
    isTransformationValid: true,
  };

  it('should validate raw transformation as valid when all fields are valid', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        indicator1: '0',
        indicator2: '0',
        subfield: '1',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual(validTransformation);
  });

  it('should validate raw transformation as valid when indicator1 is empty and indicator2 is absent', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        indicator1: '',
        subfield: '1',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual(validTransformation);
  });

  it('should validate raw transformation as valid when indicators and subfield are absent', () => {
    const transformation = { rawTransformation: { marcField: '300' } };

    expect(validateRawTransformation(transformation)).toEqual({
      ...validTransformation,
      isTransformationValid: false,
      subfield: false,
    });
  });

  it('should validate raw transformation as invalid when marcField contains letters', () => {
    const transformation = { rawTransformation: { marcField: '13a' } };

    expect(validateRawTransformation(transformation)).toEqual({
      ...validTransformation,
      marcField: false,
      isTransformationValid: false,
      subfield: false,
    });
  });

  it('should validate raw transformation as invalid when marcField length is less than 3', () => {
    const transformation = { rawTransformation: { marcField: '13' } };

    expect(validateRawTransformation(transformation)).toEqual({
      ...validTransformation,
      marcField: false,
      isTransformationValid: false,
      subfield: false,
    });
  });

  it('should validate raw transformation as invalid when marcField length is more than 3', () => {
    const transformation = { rawTransformation: { marcField: '1344' } };

    expect(validateRawTransformation(transformation)).toEqual({
      ...validTransformation,
      marcField: false,
      isTransformationValid: false,
      subfield: false,
    });
  });

  it('should validate raw transformation as invalid when marcField is empty', () => {
    const transformation = { rawTransformation: { marcField: '' } };

    expect(validateRawTransformation(transformation)).toEqual({
      ...validTransformation,
      marcField: false,
      isTransformationValid: false,
      subfield: false,
    });
  });

  it('should validate raw transformation as invalid when marcField is absent', () => {
    const transformation = { rawTransformation: {} };

    expect(validateRawTransformation(transformation)).toEqual({
      ...validTransformation,
      marcField: false,
      isTransformationValid: false,
      subfield: false,
    });
  });

  it('should validate raw transformation as invalid when indicators have more than one character', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        indicator1: '12',
        indicator2: 'aa',
        subfield: 'c',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual({
      ...validTransformation,
      indicator1: false,
      indicator2: false,
      isTransformationValid: false,
    });
  });

  it('should validate raw transformation as valid when indicators are letters', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        indicator1: 'a',
        indicator2: 'B',
        subfield: 'c',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual(validTransformation);
  });

  it('should validate raw transformation as valid when indicators are whitespaces', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        indicator1: ' ',
        indicator2: ' ',
        subfield: 'c',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual(validTransformation);
  });

  it('should validate raw transformation as valid when subfield contains $ and single digit', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        subfield: '1',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual(validTransformation);
  });

  it('should validate raw transformation as valid when subfield contains $ and two digits', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        subfield: '12',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual(validTransformation);
  });

  it('should validate raw transformation as valid when subfield contains $ and single letter', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        subfield: 'a',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual(validTransformation);
  });

  it('should validate raw transformation as invalid when subfield contains $ and more than one letter', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        subfield: 'ab',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual({
      ...validTransformation,
      subfield: false,
      isTransformationValid: false,
    });
  });

  it('should validate raw transformation as invalid when subfield contains $ and more than two digits', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        subfield: '$900',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual({
      ...validTransformation,
      subfield: false,
      isTransformationValid: false,
    });
  });

  it('should validate raw transformation as invalid when subfield contains only $', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        subfield: '$',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual({
      ...validTransformation,
      subfield: false,
      isTransformationValid: false,
    });
  });

  it('should validate raw transformation', () => {
    const transformation = {
      rawTransformation: {
        marcField: '123',
        subfield: '90',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual({
      ...validTransformation,
      subfield: true,
      isTransformationValid: true,
    });
  });

  it('should validate raw transformation as valid when all fields are absent and record has an instance type', () => {
    const transformation = { recordType: 'INSTANCE' };

    expect(validateRawTransformation(transformation)).toEqual({ isTransformationValid: true });
  });

  it('should validate raw transformation as valid when all fields are present but empty and record has an instance type', () => {
    const transformation = {
      recordType: 'INSTANCE',
      rawTransformation: {
        marcField: '',
        indicator1: '',
        indicator2: '',
        subfield: '',
      },
    };

    expect(validateRawTransformation(transformation)).toEqual({ isTransformationValid: true });
  });
});

describe('validateTransformations', () => {
  it('should return correct invalid transformations', () => {
    const transformations = [
      {
        isSelected: true,
        order: 0,
        recordType: 'HOLDINGS',
      },
      {
        isSelected: true,
        order: 1,
        recordType: 'HOLDINGS',
        rawTransformation: {
          indicator1: '0',
          indicator2: '0',
          marcField: '123',
          subfield: '$t',
        },
      },
      {
        order: 2,
        rawTransformation: {
          indicator1: 't',
          marcField: '325',
        },
        recordType: 'HOLDINGS',
      },
      {
        isSelected: false,
        order: 3,
        recordType: 'HOLDINGS',
      },
      {
        isSelected: true,
        order: 4,
        recordType: 'HOLDINGS',
        rawTransformation: { marcField: 'ABC' },
      },
    ];
    const invalidTransformations = {
      0: {
        marcField: false,
        indicator1: true,
        indicator2: true,
        subfield: false,
        isTransformationValid: false,
      },
      4: {
        marcField: false,
        indicator1: true,
        indicator2: true,
        subfield: false,
        isTransformationValid: false,
      },
    };

    expect(validateTransformations(transformations)).toMatchObject(invalidTransformations);
  });
});

describe('isRawTransformationEmpty', () => {
  it('should return true when passing undefined', () => {
    expect(isRawTransformationEmpty(undefined)).toBe(true);
  });

  it('should return true when passing empty object', () => {
    expect(isRawTransformationEmpty({})).toBe(true);
  });

  it('should return true when passing object with some empty fields present', () => {
    expect(isRawTransformationEmpty({
      marcField: '',
      subfield: '',
    })).toBe(true);
  });

  it('should return true when passing object with all fields present', () => {
    expect(isRawTransformationEmpty({
      marcField: '',
      indicator1: '',
      indicator2: '',
      subfield: '',
    })).toBe(true);
  });

  it('should return false when passing object with non empty fields', () => {
    expect(isRawTransformationEmpty({
      marcField: 'abc',
      indicator1: '',
      subfield: '',
    })).toBe(false);
  });
});

describe('isInstanceTransformationEmpty', () => {
  it('should return true, when empty instance transformation is passed', () => {
    const transformation = {
      recordType: 'INSTANCE',
      rawTransformation: {
        marcField: '',
        indicator1: '',
        indicator2: '',
        subfield: '',
      },
    };

    expect(isInstanceTransformationEmpty(transformation)).toBe(true);
  });

  it('should return false, when non empty instance transformation is passed', () => {
    const transformation = {
      recordType: 'INSTANCE',
      rawTransformation: { marcField: 'abc' },
    };

    expect(isInstanceTransformationEmpty(transformation)).toBe(false);
  });

  it('should return false, when non instance transformation is passed', () => {
    const transformation = {
      recordType: 'ITEM',
      rawTransformation: { marcField: 'abc' },
    };

    expect(isInstanceTransformationEmpty(transformation)).toBe(false);
  });
});

describe('checkTransformationValidity', () => {
  it('should return correct validity object when all fields are valid', () => {
    const validatedTransformations = {
      marcField: true,
      indicator1: true,
      indicator2: true,
      subfield: true,
    };

    expect(checkTransformationValidity(validatedTransformations)).toEqual({
      ...validatedTransformations,
      isTransformationValid: true,
    });
  });

  it('should return correct validity object when all fields are invalid', () => {
    const validatedTransformations = {
      marcField: false,
      indicator1: false,
      indicator2: false,
      subfield: false,
    };

    expect(checkTransformationValidity(validatedTransformations)).toEqual({
      ...validatedTransformations,
      isTransformationValid: false,
    });
  });

  it('should return correct validity object when both valid and invalid fields are present', () => {
    const validatedTransformations = {
      marcField: false,
      indicator1: false,
      indicator2: true,
      subfield: true,
    };

    expect(checkTransformationValidity(validatedTransformations)).toEqual({
      ...validatedTransformations,
      isTransformationValid: false,
    });
  });
});
