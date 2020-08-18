import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import {
  generateTransformationFieldsValues,
  normalizeTransformationFormValues,
} from '../../../../../../src/settings/MappingProfiles/MappingProfilesTransformationsModal/TransformationsField';

describe('generateTransformationFieldsValues', () => {
  it('should generate initial transformation values correctly', () => {
    const data = [
      {
        id: 'electronicAccess.uri',
        path: 'items[*].electronicAccess[*].uri',
        recordType: 'ITEM',
        displayName: 'Items - Electronic access - URI',
      },
      {
        id: 'materialTypeId',
        path: 'items[*].materialTypeId',
        recordType: 'ITEM',
        displayName: 'Items - Material types',
      },
    ];

    expect(generateTransformationFieldsValues(data)).to.deep.equal(
      [
        {
          fieldId: 'electronicAccess.uri',
          path: 'items[*].electronicAccess[*].uri',
          recordType: 'ITEM',
          displayName: 'Items - Electronic access - URI',
          order: 0,
        },
        {
          fieldId: 'materialTypeId',
          path: 'items[*].materialTypeId',
          recordType: 'ITEM',
          displayName: 'Items - Material types',
          order: 1,
        },
      ],
    );
  });
});

describe('normalizeTransformationFormValues', () => {
  const data = [
    {
      fieldId: 'electronicAccess.uri',
      path: 'items[*].electronicAccess[*].uri',
      recordType: 'ITEM',
      displayName: 'Items - Electronic access - URI',
      transformation: 'Transformation value 1',
      isSelected: true,
      order: 0,
    },
    {
      fieldId: 'materialTypeId',
      path: 'items[*].materialTypeId',
      recordType: 'ITEM',
      displayName: 'Items - Material types',
      transformation: 'Transformation value 2',
      order: 1,
      isSelected: false,
    },
  ];

  it('should normalize transformation values correctly and filter unselected items', () => {
    expect(normalizeTransformationFormValues(data)).to.deep.equal(
      [
        {
          fieldId: 'electronicAccess.uri',
          path: 'items[*].electronicAccess[*].uri',
          recordType: 'ITEM',
          transformation: 'Transformation value 1',
          enabled: true,
        },
      ],
    );
  });
});
