import { useEffect } from 'react';
import { buildSearch } from '@folio/stripes-acq-components';
import { useHistory } from 'react-router-dom';

export const useDefaultSorting = () => {
  const history = useHistory();

  useEffect(() => {
    return () => {
      history.replace({
        search: `${buildSearch({
          sort: 'name'
        }, history.location.search)}`,
      });
    };
  }, []);
};
