import * as Yup from 'yup'

const objectIdRegex = /^[0-9a-fA-F]{24}$/; // Regex for ObjectId format

export const agreementCsvValidator = async (data) => {
  const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: '',
        },
    },
  };
  
  const schema = Yup.array().of(
    Yup.object().shape({
      itemId: Yup.string()
        .matches(objectIdRegex, 'Invalid ObjectId format')
        .typeError('Item Id must be a string').required('Item Id is required'),
      title: Yup.string().typeError('Title must be a string').required('Title is required'),
      sku: Yup.string().typeError('Sku must be a string').required('SKU is required'),
      sellingPrice: Yup.number().typeError('Selling price must be a valid number').required('Selling price is required'),
      attributes: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().typeError('Attribute Name must be a string').required('Attribute Name is required'),
            value: Yup.string().typeError('Attribute Value must be a string').required('Attribute Value is required'),
          })
        )
        .typeError('Attributes must be an array')
        .optional(),
      tax: Yup.string().typeError('Tax must be a string').required('Tax is required'),
      unit: Yup.string().typeError('Unit must be a string').required('Unit is required'),
      type: Yup.string().typeError('Type must be a string').required('Type is required'),
  }));

  try {
    await schema.validate(data, options);
    return { data };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      // Aggregate errors for each field across all indexes
      const errorMessages = error.inner.reduce((acc, curr) => {
        const field = curr.path.split('.')[1]; // Extract the field name

        // Only add error message if the field doesn't already have an error
        if (!acc[field]) {
          acc[field] = curr.message; // Add the error message
        }
        return acc;
      }, {});

      return { errors: errorMessages };
    } else {
      console.error('Unexpected error:', error);
      return { errors: { general: 'Unexpected error occurred' } };
    }
  }
}