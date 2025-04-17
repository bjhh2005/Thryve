import React from 'react';
import { Handle } from 'reactflow';

const WordNode = ({ data }) => {
  return (
    <div className="node-container">
      
      <Handle id="workflow_input" type="source" position="right" style={{ background: 'blue', top: 20, }} />
      <Handle id="workflow_output" type="target" position="left" style={{ background: 'blue', top: 20, }} />
      
      <Handle type="source" position="bottom" />
      <Handle type="target" position="top" />


      <div className="node-content">
        <h4>Word操作</h4>
        <div className="node-details">
          <p>文件: {data.filename}</p>
        </div>
      </div>
    </div>
  );
};

export default WordNode;