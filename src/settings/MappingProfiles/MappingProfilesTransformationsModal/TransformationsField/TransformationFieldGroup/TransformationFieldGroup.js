import { useState } from 'react';

export const TransformationFieldGroup = ({ transformation }) => {
  // marcField: <value>,
  // indicator1: <value>,
  // indicator2: <value>,
  // subfield: <value>,

  const [parsedTransformation, setParsedTransformation] = useState({});

  const parseTransformationValue = () => {

  };

  return (
        <>
          <Field
            component={TextField}
            name={`transformations[${record.order}].transformation`}
            marginBottom0
          />
          <Field
            component={TextField}
            name={`transformations[${record.order}].transformation`}
            marginBottom0
          />
          <Field
            component={TextField}
            name={`transformations[${record.order}].transformation`}
            marginBottom0
          />
          <Field
            component={TextField}
            name={`transformations[${record.order}].transformation`}
            marginBottom0
          />
        </>
  );
};
