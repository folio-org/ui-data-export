import {
  getAllByRole, screen, within,
} from '@testing-library/react';

export const recordTypeInstance = () => screen.getByRole('checkbox', { name: 'ui-data-export.mappingProfiles.recordType.instance' });
export const recordTypesSRS = () => screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.srs' });
export const recordTypesHoldings = () => screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.holdings' });
export const recordTypesItem = () => screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.item' });

export const nameField = () => screen.getByRole('textbox', { name: /name/i });
export const descriptionField = () => screen.getByRole('textbox', { name: /description/i });

export const saveAndCloseBtn = () => screen.getByRole('button', { name: 'stripes-components.saveAndClose' });
export const transformationsBtn = name => screen.getByRole('button', { name });

export const transformationListRows = () => getAllByRole(screen.getByRole('rowgroup'), 'row');
export const transformationListCells = () => within(transformationListRows()[0]).getByText('Instance - Resource title');
export const columnHeaderFieldName = () => screen.getAllByRole('columnheader', { name: 'ui-data-export.mappingProfiles.transformations.fieldName' });
export const columnHeaderTransformation = () => screen.getAllByRole('columnheader', { name: 'ui-data-export.mappingProfiles.transformations.field' });

export const paneHeader = name => screen.getByRole('heading', { name });
