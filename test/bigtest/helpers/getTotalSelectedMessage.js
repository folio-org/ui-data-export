export const getTotalSelectedMessage = (translations, selectedCount) => {
  return translations['modal.totalSelected'].replace('{count}', selectedCount);
};
