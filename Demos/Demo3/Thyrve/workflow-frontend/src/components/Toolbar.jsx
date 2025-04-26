import React from 'react';
import { Card } from 'antd';
import { nodeConfigs } from './Nodes';

const Toolbar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="toolbar">
      <h3>工具箱</h3>
      {Object.values(nodeConfigs).map((config) => (
        <Card
          key={config.type}
          draggable
          onDragStart={(e) => onDragStart(e, config.type)}
          style={{ margin: '8px', cursor: 'move' }}
        >
          {config.label}
        </Card>
      ))}
    </div>
  );
};

export default Toolbar;