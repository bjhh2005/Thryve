import React from 'react';
import { Handle } from 'reactflow';

const printNode = ({ data }) => {
  return (
    <div className="node-container">
      
      <Handle id="workflow_input" type="target" position="left" style={{ background: 'red', top: 20, }} />
      <Handle id="workflow_output" type="source" position="right" style={{ background: 'blue', top: 20, }} />
      

      <div className="node-content">
        <h4>print</h4>
        <div className="node-details">
          <p>打印内容: {data.content}</p>
        </div>
      </div>
    </div>
  );
};

export default printNode;