import React from 'react';
import { Spin } from 'antd';

const Loading = () => {
  return (
    <div id="loading">
      <Spin size="large" />
      <div className="lh-5">努力加载中...</div>
    </div>
  );
};
export default Loading;
