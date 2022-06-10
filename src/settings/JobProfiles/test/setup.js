import { within } from '@testing-library/react';

export const checkJobProfileFormState = async (form, { title }) => {
  const formTitle = await within(form).findByText(title);
  const nameInput = await within(form).findByLabelText(/Name/i);
  const mappingProfileInput = await within(form).findByLabelText(/Mapping profile/i);
  const descriptionInput = await within(form).findByLabelText('Description');

  expect(form).toBeVisible();
  expect(formTitle).toBeVisible();
  expect(nameInput).toBeVisible();
  expect(mappingProfileInput).toBeVisible();

  expect(descriptionInput).toBeVisible();

  expect(nameInput).toBeEnabled();
  expect(descriptionInput).toBeEnabled();
  expect(mappingProfileInput).toBeEnabled();

  return {
    formTitle,
    nameInput,
    mappingProfileInput,
    descriptionInput,
  };
};
