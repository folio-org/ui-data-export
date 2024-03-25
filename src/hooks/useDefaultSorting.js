import { useEffect } from 'react';
import { buildSearch } from '@folio/stripes-acq-components';
import { useHistory } from 'react-router-dom';

// eslint-disable-next-line import/prefer-default-export
export const useDefaultSorting = () => {
  const history = useHistory();

  useEffect(() => {
    history.replace({
      search: `${buildSearch({
        sort: 'name'
      }, history.location.search)}`,
    });

    // clear search params on unmount to avoid conflicts with other components
    return () => {
      history.replace({
        search: '',
      });
    };
  }, []);
};
