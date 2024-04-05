import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const StyledButton = ({ color, className, onClick, isLoading, children, ...props }) => {
  return (
    <Button
      color={color}
      className={className}
      onClick={onClick}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <div className="spinner-border spinner-border-sm" role="status" /> : children}
    </Button>
  )
}

StyledButton.propType = {
  color: PropTypes.oneOf(['primary', 'secondary']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ])
}

export default StyledButton