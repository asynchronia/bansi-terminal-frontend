import React, { useState } from "react";



const MultipleLayerSelect = ({categories,setCategoryData}) => {
 


  const handleCategoryClick = (categoryId, categoryName) => {
    setCategoryData({ id: categoryId, name: categoryName, show:false });
  };

  const handleChildClick = (event, childId, childName) => {
    event.stopPropagation();
    setCategoryData({ id: childId, name: childName , show:false });
  };

  const handleGrandchildClick = (event, grandchildId, grandchildName) => {
    event.stopPropagation();
    setCategoryData({ id: grandchildId, name: grandchildName, show:false  });
  };

  return (
    <div style={{ maxHeight: "200px", overflowY: "scroll" }}>
      {categories.map((category) => (
        <div
          style={{
            border: "1px solid #dee2e6",
            padding: "2px 5px",
            cursor: "pointer",
          }}
          key={category._id}
          className="option"
          onClick={() => handleCategoryClick(category._id, category.name)}
        >
          {` ${category.name}`}
          {category.children && (
            <div className="child-options">
              {category.children.map((child) => (
                <div
                  style={{
                    border: "1px solid #dee2e6",
                    padding: "2px 5px",
                    cursor: "pointer",
                  }}
                  key={child._id}
                  className="child-option"
                  onClick={(event) =>
                    handleChildClick(event, child._id, child.name)
                  }
                >
                {` ${child.name}`}
                  {child.children && (
                    <div
                      style={{
                        border: "1px solid #dee2e6",
                        padding: "2px 5px",
                        cursor: "pointer",
                      }}
                      className="grandchild-options"
                    >
                      {child.children.map((grandchild) => (
                        <div
                          key={grandchild._id}
                          className="grandchild-option"
                          onClick={(event) =>
                            handleGrandchildClick(
                              event,
                              grandchild._id,
                              grandchild.name
                            )
                          }
                        >
                           {` ${grandchild.name}`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MultipleLayerSelect;
