import React from 'react';
import { Handle } from 'reactflow';

const ExcelNode = ({ data }) => {
  return (
    <div className="node-container">
      <Handle type="target" position="top" />
      <div className="node-content">
        <h4>Excel操作</h4>
        <div className="node-details">
          <p>文件: {data.filename}</p>
          <p>操作: {data.operation}</p>
        </div>
      </div>
      <Handle type="source" position="bottom" />
    </div>
  );
};

export default ExcelNode;