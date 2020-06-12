import PropTypes from 'prop-types';

export const mappingProfilesShape = PropTypes.shape({
  hasLoaded: PropTypes.bool,
  records: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    outputFormat: PropTypes.string.isRequired,
    recordTypes: PropTypes.arrayOf(PropTypes.string),
    transformations: PropTypes.arrayOf(PropTypes.object),
    metadata: PropTypes.shape({
      createdByUserId: PropTypes.string.isRequired,
      createdByUsername: PropTypes.string.isRequired,
      createdDate: PropTypes.string.isRequired,
      updatedByUserId: PropTypes.string,
      updatedByUsername: PropTypes.string,
      updatedDate: PropTypes.string,
    }).isRequired,
  })),
});
