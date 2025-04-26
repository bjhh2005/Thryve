import React from 'react';
import { Handle } from 'reactflow';


const ExcelNode = ({ data }) => {
  return (
    <div className="node-container">
      
      <Handle id="workflow_input" type="source" position="right" style={{ background: 'blue', top: 20, }} />
      <Handle id="workflow_output" type="target" position="left" style={{ background: 'blue', top: 20, }} />
      

      <div className="node-content">
        <h4>Excel操作</h4>
        <div className="node-details">
          <p>文件: {data.filename}</p>
          <p>操作: {data.operation}</p>
        </div>
      </div>
    </div>
  );
};

export default ExcelNode;