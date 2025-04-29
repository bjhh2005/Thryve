import React from 'react';
import { Handle } from 'reactflow';

const LoopNode = ({ data }) => {
  return (
    <div className="node-container">
      
      <Handle id="workflow_output_loopbody" type="source" position="right" style={{ background: 'black', top: 20, }} />
      <Handle id="workflow_input" type="target" position="left" style={{ background: 'red', top: 20, }} />
      <Handle id="workflow_output" type='source' position='right' style={{ background: 'blue', bottom: 20, }} />

      <div className="node-content">
        <h4>Loop节点</h4>
        <div className="node-details">
          <p>循环次数: {data.Loopcnt}</p>
        </div>
      </div>
    </div>
  );
};

export default LoopNode;