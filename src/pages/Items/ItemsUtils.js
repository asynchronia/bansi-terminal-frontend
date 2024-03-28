//Function to List Attributes in ViewItem Table
export function attributesCellRenderer(params) {
    const attributes = params.value;

    let formattedAttributes = '';

    attributes.forEach(attribute => {
        formattedAttributes += `${attribute.name}: ${attribute.value}, `;
    });

    formattedAttributes = formattedAttributes.slice(0, -2);

    return formattedAttributes;
}

// Function to find category name by ID
export const findCategoryNameById = (categoryId, categories) => {
    const findInCategories = (categories) => {
      for (const category of categories) {
        if (category._id === categoryId) {
          return category.name;
        }
        if (category.children) {
          const foundInChildren = findInCategories(category.children);
          if (foundInChildren) return foundInChildren;
        }
      }
      return null;
    };
  
    return findInCategories(categories);
  };