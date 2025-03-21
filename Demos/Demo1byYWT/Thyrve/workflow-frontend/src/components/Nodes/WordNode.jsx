import React from 'react';
import { Handle } from 'reactflow';

const WordNode = ({ data }) => {
  return (
    <div className="node-container">
      <Handle type="target" position="top" />
      <div className="node-content">
        <h4>Word操作</h4>
        <div className="node-details">
          <p>文件: {data.filename}</p>
        </div>
      </div>
      <Handle type="source" position="bottom" />
    </div>
  );
};

export default WordNode;