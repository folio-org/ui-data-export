import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import {
  generateSelectedTransformations,
  generateTransformationFieldsValues,
  normalizeTransformationFormValues,
} from '../../../../../../src/settings/MappingProfiles/MappingProfilesTransformationsModal/TransformationsField';

describe('generateTransformationFieldsValues', () => {
  const allTransformations = [
    {
      fieldId: 'electronicAccess.uri',
      path: 'items[*].electronicAccess[*].uri',
      recordType: 'ITEM',
      displayNameKey: 'electronicAccess.uri',
    },
    {
      fieldId: 'materialTypeId',
      path: 'items[*].materialTypeId',
      recordType: 'ITEM',
      displayNameKey: 'materialTypeId',
    },
  ];

  it('should generate initial transformation values correctly with empty profile transformations', () => {
    expect(generateTransformationFieldsValues(allTransformations)).to.deep.equal(
      [
        {
          fieldId: 'electronicAccess.uri',
          path: 'items[*].electronicAccess[*].uri',
          recordType: 'ITEM',
          displayNameKey: 'electronicAccess.uri',
          order: 0,
        },
        {
          fieldId: 'materialTypeId',
          path: 'items[*].materialTypeId',
          recordType: 'ITEM',
          displayNameKey: 'materialTypeId',
          order: 1,
        },
      ]
    );
  });

  it('should generate initial transformation values correctly with non empty profile transformations', () => {
    const profileTransformations = [
      {
        fieldId: 'materialTypeId',
        path: 'items[*].materialTypeId',
        recordType: 'ITEM',
        enabled: true,
        transformation: '12300$a',
      },
      {
        fieldId: 'electronicAccess.uri',
        path: 'items[*].electronicAccess[*].uri',
        recordType: 'ITEM',
        transformation: '44401$12',
      },
    ];

    expect(generateTransformationFieldsValues(allTransformations, profileTransformations)).to.deep.equal(
      [
        {
          fieldId: 'electronicAccess.uri',
          path: 'items[*].electronicAccess[*].uri',
          recordType: 'ITEM',
          displayNameKey: 'electronicAccess.uri',
          isSelected: false,
          order: 0,
          transformation: '44401$12',
          rawTransformation: {
            marcField: '444',
            indicator1: '0',
            indicator2: '1',
            subfield: '$12',
          },
        },
        {
          fieldId: 'materialTypeId',
          path: 'items[*].materialTypeId',
          recordType: 'ITEM',
          displayNameKey: 'materialTypeId',
          isSelected: true,
          order: 1,
          transformation: '12300$a',
          rawTransformation: {
            marcField: '123',
            indicator1: '0',
            indicator2: '0',
            subfield: '$a',
          },
        },
      ]
    );
  });

  it('should not process in any way profile transformations with `fieldId` which does not match any profile in all transformations', () => {
    const profileTransformations = [
      {
        fieldId: 'UNKNOWN_FIELD_ID',
        path: 'items[*].materialTypeId',
        recordType: 'ITEM',
        enabled: true,
        transformation: 'Transformation value',
      },
    ];

    expect(generateTransformationFieldsValues(allTransformations, profileTransformations)).to.deep.equal(
      [
        {
          ...allTransformations[0],
          order: 0,
        },
        {
          ...allTransformations[1],
          order: 1,
        },
      ]
    );
  });
});

describe('normalizeTransformationFormValues', () => {
  const data = [
    {
      fieldId: 'electronicAccess.uri',
      path: 'items[*].electronicAccess[*].uri',
      recordType: 'ITEM',
      displayNameKey: 'electronicAccess.uri',
      referenceDataValue: 'Reference data',
      rawTransformation: {
        marcField: '444',
        indicator1: '0',
        indicator2: '1',
        subfield: '$12',
      },
      isSelected: true,
      order: 0,
    },
    {
      fieldId: 'materialTypeId',
      path: 'items[*].materialTypeId',
      recordType: 'ITEM',
      displayNameKey: 'materialTypeId',
      transformation: 'Transformation value 2',
      isSelected: false,
      order: 1,
    },
  ];

  it('should normalize transformation values correctly and filter unselected items', () => {
    expect(normalizeTransformationFormValues(data)).to.deep.equal(
      [
        {
          fieldId: 'electronicAccess.uri',
          path: 'items[*].electronicAccess[*].uri',
          recordType: 'ITEM',
          transformation: '44401$12',
          rawTransformation: {
            marcField: '444',
            indicator1: '0',
            indicator2: '1',
            subfield: '$12',
          },
          enabled: true,
        },
      ]
    );
  });
});

describe('generateSelectedTransformations', () => {
  const data = [
    {
      fieldId: 'fieldId1',
      isSelected: true,
    },
    {
      fieldId: 'fieldId2',
      order: 1,
    },
  ];

  it('should contain all transformations in the selected list', () => {
    expect(generateSelectedTransformations(data, transformation => transformation)).to.deep.equal({
      fieldId1: true,
      fieldId2: true,
    });
  });

  it('should contain only transformations which fulfilled the predicate', () => {
    expect(generateSelectedTransformations(data, transformation => transformation.isSelected && transformation)).to.deep.equal({ fieldId1: true });
  });
});
