//Function to List Attributes in ViewItem Table
import React from 'react';
import Chip from '@mui/material/Chip';

export function attributesCellRenderer(params) {
    const attributes = params.value;

    return (
        <div >
            {attributes.map((attribute, index) => (
                <Chip
                    key={index}
                    label={`${attribute.name}: ${attribute.value}`}
                    variant="outlined"
                    style={{ margin: '4px' }}
                />
            ))}
        </div>
    );
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