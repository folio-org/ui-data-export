import {
  omitRawTransformations,
  parseRawTransformation,
  splitIntoRawTransformation,
} from './processRawTransformations';

describe('parseRawTransformation', () => {
  it('should return correct transformation when all fields are present', () => {
    expect(parseRawTransformation({
      rawTransformation: {
        marcField: '900',
        indicator1: '0',
        indicator2: '0',
        subfield: '$12',
      },
    })).toBe('90000$12');
  });

  it('should return correct transformation when first indicator is absent', () => {
    expect(parseRawTransformation({
      rawTransformation: {
        marcField: '900',
        indicator2: '0',
        subfield: '$12',
      },
    })).toBe('900 0$12');
  });

  it('should return correct transformation when second indicator is absent', () => {
    expect(parseRawTransformation({
      rawTransformation: {
        marcField: '900',
        indicator1: '1',
        subfield: '$12',
      },
    })).toBe('9001 $12');
  });

  it('should return correct transformation when both indicators are empty', () => {
    expect(parseRawTransformation({
      rawTransformation: {
        marcField: '900',
        indicator1: '',
        indicator2: '',
        subfield: '$12',
      },
    })).toBe('900  $12');
  });
});

describe('splitIntoRawTransformation', () => {
  it('should return correct raw transformation when all fields are present and subfield containing 2 digits', () => {
    expect(splitIntoRawTransformation('90012$12')).toEqual({
      marcField: '900',
      indicator1: '1',
      indicator2: '2',
      subfield: '$12',
    });
  });

  it('should return correct raw transformation when indicator2 is empty s are present and subfield containing 1 digit', () => {
    expect(splitIntoRawTransformation('9001 $1')).toEqual({
      marcField: '900',
      indicator1: '1',
      indicator2: '',
      subfield: '$1',
    });
  });

  it('should return correct raw transformation when indicator1 is empty and subfield containing letter', () => {
    expect(splitIntoRawTransformation('900 2$r')).toEqual({
      marcField: '900',
      indicator1: '',
      indicator2: '2',
      subfield: '$r',
    });
  });
});

describe('omitRawTransformations', () => {
  it('should return correct data', () => {
    const profile = {
      transformations: [
        {
          fieldId: 'holdings.callnumber',
          rawTransformation: {
            indicator1: '1',
            indicator2: '1',
            marcField: '900',
            subfield: '$12',
          },
        },
        {
          fieldId: 'holdings.callnumberprefix',
          rawTransformation: {
            marcField: '700',
            subfield: '$0',
          },
        },
      ],
    };

    expect(omitRawTransformations(profile)).toEqual({
      transformations: [
        { fieldId: 'holdings.callnumber' },
        { fieldId: 'holdings.callnumberprefix' },
      ],
    });
  });
});
