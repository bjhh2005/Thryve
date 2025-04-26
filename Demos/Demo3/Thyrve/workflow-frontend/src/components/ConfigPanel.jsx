import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { nodeConfigs } from './Nodes';

const ConfigPanel = ({ selectedNode, onConfigChange }) => {
  if (!selectedNode) {
    return <div className="config-panel">请选择节点进行配置</div>;
  }

  const nodeConfig = nodeConfigs[selectedNode.type];

  return (
    <div className="config-panel">
      <h3>节点配置</h3>
      <Form
        layout="vertical"
        initialValues={selectedNode.data}
        onValuesChange={(_, allValues) => onConfigChange(allValues)}
      >
        {nodeConfig.configs.map((config) => (
          <Form.Item key={config.key} label={config.label} name={config.key}>
            {config.type === 'input' && <Input />}
            {config.type === 'select' && (
              <Select options={config.options} />
            )}
            {config.type === 'textarea' && <Input.TextArea />}
          </Form.Item>
        ))}
      </Form>
    </div>
  );
};

export default ConfigPanel;