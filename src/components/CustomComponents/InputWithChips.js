import React from "react"
import Chip from "@mui/material/Chip"

const InputWithChips = props => {
  const {
    chips,
    inputValue,
    handleInputChange,
    handleInputKeyPress,
    handleChipDelete,
  } = props
  return (
    <div className="mt-4">
      <label className="form-label">Enter Variants Name</label>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid #dee2e6",
          borderRadius: "5px",
        }}
      >
        {chips.map((chip, index) => (
          <Chip
            key={index}
            label={chip}
            onDelete={() => handleChipDelete(index)}
            style={{ margin:"2px 5px" }}
          />
        ))}
        <input
          type="text"
          className="form-label"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          style={{
            flex: "1",
            border: "none",
            outline: "none",
            marginBottom: "5px",
          }}
        />
      </div>
    </div>
  )
}

export default InputWithChips
