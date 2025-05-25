import React from 'react';
import { Handle } from 'reactflow';

const EndNode = ({ data }) => {
  return (
    <div className="node end-node" style={{ 
      background: '#fff', 
      padding: '10px 20px',
      border: '2px solid #ff4d4f',
      borderRadius: '5px',
      width: '150px'
    }}>
      <Handle
        type="target"
        position="top"
        style={{ background: '#555' }}
      />
      <div style={{ 
        textAlign: 'center',
        color: '#ff4d4f',
        fontWeight: 'bold'
      }}>
        结束节点
      </div>
    </div>
  );
};

export default EndNode; 