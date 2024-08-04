import React, { useState } from "react";

const MultipleLayerSelect = ({ categories, setCategoryData, levelTwo, setBodyData }) => {
  const handleCategoryClick = (event, categoryId, categoryName) => {
    event.stopPropagation();
    setCategoryData({ id: categoryId, name: categoryName, show: false });
    setBodyData(prevState => ({ ...prevState, filter: { category: categoryId } }));
  };

  const handleChildClick = (event, childId, childName) => {
    event.stopPropagation();
    setCategoryData({ id: childId, name: childName, show: false });
    setBodyData(prevState => ({ ...prevState, filter: { category: childId } }));
  };

  const handleGrandchildClick = (event, grandchildId, grandchildName) => {
    event.stopPropagation();
    setCategoryData({ id: grandchildId, name: grandchildName, show: false });
    setBodyData(prevState => ({ ...prevState, filter: { category: grandchildId } }));
  };

  const handleAllCategoriesClick = () => {
    setCategoryData({ id: null, name: "", show: false });
    setBodyData((prevState) => ({
      ...prevState,
      filter: { category: null },
    }));
  };

  return (
    <div style={{ maxHeight: "200px", overflowY: "scroll" }}>
      <div
        style={{
          padding: "3px 8px",
          cursor: "pointer",
          border: "none",
        }}
        className="option"
        onClick={handleAllCategoriesClick}
      >
        <h6
          onMouseEnter={(event) => {
            event.target.style.backgroundColor = "#bfd8f7";
          }}
          onMouseLeave={(event) => {
            event.target.style.backgroundColor = "#f5f5f5";
          }}
          style={{ fontWeight: "bolder", padding: "3px" }}
        >
          All Categories
        </h6>
      </div>
      {categories.map((category) => (
        <div
          style={{
            padding: "3px 8px",
            cursor: "pointer",
            border: "none",
          }}
          key={category._id}
          className="option"
          onClick={(event) => handleCategoryClick(event, category._id, category.name)}
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
                  {levelTwo && child.children &&(
                    <div
                      style={{
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                      className="grandchild-options"
                    >
                      {levelTwo? child.children.map((grandchild) => (
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
                      )):null}
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
