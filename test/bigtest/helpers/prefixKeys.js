// mimics the StripesTranslationPlugin in @folio/stripes-core
export const prefixKeys = (translations, translationPrefix) => {
  const reducer = (result, [key, value]) => {
    result[`${translationPrefix}.${key}`] = value;

    return result;
  };

  return Object.entries(translations).reduce(reducer, {});
};
