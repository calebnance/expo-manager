import React from 'react';
import PropTypes from 'prop-types';

const IconFolder = ({ fill, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M20 5h-8.5L9.8 2.4C9.6 2.2 9.3 2 9 2H4C2.3 2 1 3.3 1 5v14c0 1.7 1.3 3 3 3h16c1.7 0 3-1.3 3-3V8c0-1.7-1.3-3-3-3zm1 14c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1h4.5l1.7 2.6c.2.2.5.4.8.4h9c.6 0 1 .4 1 1v11z"
      fill={fill}
    />
  </svg>
);

IconFolder.defaultProps = {
  fill: '#000',
  size: 20
};

IconFolder.propTypes = {
  // optional
  fill: PropTypes.string,
  size: PropTypes.number
};

export default IconFolder;
