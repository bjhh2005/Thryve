import React from 'react';
import { Card, Collapse } from 'antd';
import { nodeConfigs } from './Nodes';

const { Panel } = Collapse;

const Toolbar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // 分类
  const groupedConfigs = {};
  Object.values(nodeConfigs).forEach((config) => {
    const category = config.category || '其他';
    if (!groupedConfigs[category]) groupedConfigs[category] = [];
    groupedConfigs[category].push(config);
  });

  return (
    <div className="toolbar">
      <div className="options">
        <h3>工具箱</h3>
      </div>
      <Collapse
        className='toolbar-collapse'
        defaultActiveKey={Object.keys(groupedConfigs)}
      >
        {Object.entries(groupedConfigs).map(([category, configs]) => (
          <Panel header={category} key={category}>
            {configs.map((config) => (
              <Card
                className={`toolbar-node ${category}`}
                key={config.type}
                draggable
                onDragStart={(e) => onDragStart(e, config.type)}
              >
                {config.label}
              </Card>
            ))}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default Toolbar;