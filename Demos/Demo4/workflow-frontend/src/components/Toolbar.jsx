import React from 'react';
import { nodeConfigs } from './Nodes';

const Toolbar = ({ onDragStart }) => {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="toolbar">
      <h2>工具箱</h2>
      <div className="tools">
        {Object.entries(nodeConfigs).map(([type, config]) => (
          <div
            key={type}
            className="tool-item"
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            style={{
              padding: '10px',
              margin: '5px',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'grab',
              userSelect: 'none'
            }}
          >
            {config.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;