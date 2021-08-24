import {
  getAllByRole, screen, within,
} from '@testing-library/react';
import translations from '../../../../translations/ui-data-export/en';

export const recordTypeInstance = () => screen.getByRole('checkbox', { name: /instance/i });
export const recordTypesSRS = () => screen.getByRole('checkbox', { name: /source record storage/i });
export const recordTypesHoldings = () => screen.getByRole('checkbox', { name: /holdings/i });
export const recordTypesItem = () => screen.getByRole('checkbox', { name: /item/i });

export const nameField = () => screen.getByRole('textbox', { name: /name/i });
export const descriptionField = () => screen.getByRole('textbox', { name: /description/i });

export const saveAndCloseBtn = () => screen.getByRole('button', { name: 'Save & close' });
export const transformationsBtn = name => screen.getByRole('button', { name });

export const transformationListRows = () => getAllByRole(screen.getByRole('rowgroup'), 'row');
export const transformationListCells = () => within(transformationListRows()[0]).getByText('Instance - Resource title');
export const columnHeaderFieldName = () => screen.getAllByRole('columnheader', { name: translations['mappingProfiles.transformations.fieldName'] });
export const columnHeaderTransformation = () => screen.getAllByRole('columnheader', { name: translations['mappingProfiles.transformations.transformation'] });

export const paneHeader = name => screen.getByRole('heading', { name });
