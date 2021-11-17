export const getFormattedMappingProfiles = (mappingProfiles = []) => (
  mappingProfiles
    .map(({
      name: label, id: value,
    }) => ({
      label,
      value,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
);
