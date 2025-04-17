// add By Zhang Ruixin

import React from 'react';
import { Handle } from 'reactflow';

const startNode = () => {
  return (
    <div className="node-container">
      
      <Handle id="workflow_output" type="source" position="right" style={{ background: 'blue', top: 20, }} />
      
      <div className="node-content">
        <h4>Start</h4>
      </div>

    </div>
  );
};

export default startNode;