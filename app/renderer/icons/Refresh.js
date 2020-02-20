import React from 'react';
import PropTypes from 'prop-types';

const IconRefresh = ({ fill, size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <path
      d="M5.937 12.445c.483-1.364 1.213-2.567 2.121-3.576.944-1.049 2.083-1.893 3.34-2.492s2.628-.955 4.039-1.029c1.356-.072 2.751.117 4.115.6 1.581.56 2.941 1.451 3.977 2.507L27.301 12h-4.635c-.736 0-1.333.597-1.333 1.333s.597 1.333 1.333 1.333h8.015c.183-.001.357-.041.515-.109.163-.071.308-.172.429-.297.017-.019.036-.037.052-.057.096-.111.173-.239.228-.376.055-.136.087-.283.092-.436.003-.02.003-.039.003-.057v-8c0-.736-.597-1.333-1.333-1.333s-1.333.597-1.333 1.333v4.919l-3.901-3.665c-1.323-1.347-3.028-2.457-4.991-3.152-1.7-.601-3.444-.839-5.144-.749-1.765.093-3.479.537-5.047 1.285S7.26 5.773 6.078 7.087c-1.139 1.265-2.052 2.769-2.653 4.471-.245.695.117 1.456.812 1.701s1.456-.117 1.701-.812zm-3.27 9.304l3.94 3.703c1.245 1.247 2.717 2.212 4.289 2.864 1.632.676 3.371 1.015 5.108 1.015s3.476-.337 5.108-1.012c1.573-.651 3.045-1.615 4.321-2.891 1.472-1.472 2.535-3.209 3.148-4.993.24-.696-.131-1.455-.828-1.695s-1.455.131-1.695.828c-.481 1.4-1.324 2.788-2.511 3.975-1.024 1.023-2.2 1.793-3.456 2.312-1.304.54-2.696.811-4.088.809s-2.783-.272-4.087-.812c-1.255-.52-2.431-1.291-3.484-2.343L4.699 20h4.633c.736 0 1.333-.597 1.333-1.333s-.597-1.333-1.333-1.333H1.317c-.183.001-.357.041-.515.109-.163.071-.309.173-.431.3-.017.017-.033.036-.049.055-.096.112-.175.24-.229.379-.053.136-.085.281-.092.435-.003.019-.003.037-.003.056v8c0 .736.597 1.333 1.333 1.333s1.333-.597 1.333-1.333z"
      fill={fill}
    />
  </svg>
);

IconRefresh.defaultProps = {
  fill: '#fff',
  size: 20
};

IconRefresh.propTypes = {
  // optional
  fill: PropTypes.string,
  size: PropTypes.number
};

export default IconRefresh;
