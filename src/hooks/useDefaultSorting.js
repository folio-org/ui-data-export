import { useEffect } from 'react';
import { buildSearch } from '@folio/stripes-acq-components';
import { useHistory } from 'react-router-dom';

// eslint-disable-next-line import/prefer-default-export
export const useDefaultSorting = () => {
  const history = useHistory();

  useEffect(() => {
    const setDefaultSort = (sort) => history.replace({
      search: `${buildSearch({
        sort,
      }, history.location.search)}`,
    });

    setDefaultSort('name');

    // clear sort params on unmount to avoid conflicts with other components
    return () => {
      setDefaultSort(null);
    };
  }, []);
};
