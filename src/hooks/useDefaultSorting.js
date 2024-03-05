import { useEffect } from 'react';
import { buildSearch } from '@folio/stripes-acq-components';
import { useHistory } from 'react-router-dom';

export const useDefaultSorting = () => {
  const history = useHistory();

  useEffect(() => {
    history.replace({
      search: `${buildSearch({
        sort: 'name'
      }, history.location.search)}`,
    });
  }, []);
};
