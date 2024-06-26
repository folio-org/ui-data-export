import { useEffect } from 'react';
import { buildSearch } from '@folio/stripes-acq-components';
import { useHistory } from 'react-router-dom';

const useDefaultSorting = (paramName = 'name') => {
  const history = useHistory();

  useEffect(() => {
    const setDefaultSort = (sort) => history.replace({
      search: `${buildSearch({
        sort
      }, history.location.search)}`,
    });

    setDefaultSort(paramName);

    // clear sort params on unmount to avoid conflicts with other components
    return () => {
      setDefaultSort(null);
    };
  }, []);
};

export default useDefaultSorting;
