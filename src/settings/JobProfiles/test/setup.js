import { within } from '@testing-library/react';

export const checkJobProfileFormState = async (form, {
  title, isTCPIPEnabled,
}) => {
  const formTitle = await within(form).findByText(title);
  const nameInput = await within(form).findByLabelText(/Name/i);
  const mappingProfileInput = await within(form).findByLabelText(/Mapping profile/i);
  const tcpipInput = await within(form).findByLabelText('TCP/IP');
  const descriptionInput = await within(form).findByLabelText('Description');

  expect(form).toBeVisible();
  expect(formTitle).toBeVisible();
  expect(nameInput).toBeVisible();
  expect(mappingProfileInput).toBeVisible();
  expect(tcpipInput).toBeVisible();
  expect(descriptionInput).toBeVisible();

  expect(nameInput).toBeEnabled();
  expect(descriptionInput).toBeEnabled();
  expect(mappingProfileInput).toBeEnabled();

  if (isTCPIPEnabled) {
    expect(tcpipInput).toBeEnabled();
  } else {
    expect(tcpipInput).not.toBeEnabled();
  }

  return {
    formTitle,
    nameInput,
    mappingProfileInput,
    tcpipInput,
    descriptionInput,
  };
};
