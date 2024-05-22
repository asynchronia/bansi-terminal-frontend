import React, { useState } from "react";

const MultipleLayerSelect = ({ categories, setCategoryData }) => {
  const handleCategoryClick = (categoryId, categoryName) => {
    setCategoryData({ id: categoryId, name: categoryName, show: false });
  };

  const handleChildClick = (event, childId, childName) => {
    event.stopPropagation();
    setCategoryData({ id: childId, name: childName, show: false });
  };

  const handleGrandchildClick = (event, grandchildId, grandchildName) => {
    event.stopPropagation();
    setCategoryData({ id: grandchildId, name: grandchildName, show: false });
  };

  return (
    <div style={{ maxHeight: "200px", overflowY: "scroll" }}>
      {categories.map((category) => (
        <div
          style={{
            padding: "3px 8px",
            cursor: "pointer",
            border: "none",
          }}
          key={category._id}
          className="option"
          onClick={() => handleCategoryClick(category._id, category.name)}
        >
          <h6
            onMouseEnter={(event) => {
              event.target.style.backgroundColor = "#bfd8f7";
            }}
            onMouseLeave={(event) => {
              event.target.style.backgroundColor = "#f5f5f5";
            }}
            style={{ fontWeight: "bolder", padding: "3px" }}
          >{` ${category.name}`}</h6>
          {category.children && (
            <div className="child-options">
              {category.children.map((child) => (
                <div
                  style={{
                    padding: "3px 8px",
                    cursor: "pointer",
                  }}
                  key={child._id}
                  className="child-option"
                  onClick={(event) =>
                    handleChildClick(event, child._id, child.name)
                  }
                >
                  <div
                    onMouseEnter={(event) => {
                      event.target.style.backgroundColor = "#bfd8f7";
                    }}
                    onMouseLeave={(event) => {
                      event.target.style.backgroundColor = "#f5f5f5";
                    }}
                    style={{ padding: "2px" }}
                  >{` ${child.name}`}</div>
                  {child.children && (
                    <div
                      style={{
                        padding: "2px 8px",
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
                          <div
                            onMouseEnter={(event) => {
                              event.target.style.backgroundColor = "#bfd8f7";
                            }}
                            onMouseLeave={(event) => {
                              event.target.style.backgroundColor = "#f5f5f5";
                            }}
                            style={{ padding: "2px" }}
                          >{` ${grandchild.name}`}</div>
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
