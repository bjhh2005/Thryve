import React from 'react';
import { Form, Input, Select } from 'antd';
import FileSelector from './FileSelector';
import { nodeConfigs } from './Nodes';

const ConfigPanel = ({ selectedNode, onConfigChange }) => {
  if (!selectedNode) {
    return (
      <div className="config-panel" style={{ padding: '20px' }}>
        <h3>节点配置</h3>
        <p>请选择一个节点进行配置</p>
      </div>
    );
  }

  const nodeConfig = nodeConfigs[selectedNode.type];
  if (!nodeConfig) {
    return (
      <div className="config-panel" style={{ padding: '20px' }}>
        <h3>节点配置</h3>
        <p>该节点类型不需要配置</p>
      </div>
    );
  }

  const handleValueChange = (changedValues, allValues) => {
    onConfigChange(allValues);
  };

  const renderConfigItem = (config) => {
    switch (config.type) {
      case 'input':
        return <Input placeholder={`请输入${config.label}`} />;
      case 'textarea':
        return <Input.TextArea rows={4} placeholder={`请输入${config.label}`} />;
      case 'select':
        return (
          <Select placeholder={`请选择${config.label}`}>
            {config.options.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case 'file':
        return <FileSelector />;
      default:
        return <Input />;
    }
  };

  return (
    <div className="config-panel" style={{ padding: '20px' }}>
      <h3>{nodeConfig.label}配置</h3>
      <Form
        layout="vertical"
        initialValues={selectedNode.data}
        onValuesChange={handleValueChange}
      >
        {nodeConfig.configs.map(config => (
          <Form.Item
            key={config.key}
            name={config.key}
            label={config.label}
            rules={[
              {
                required: true,
                message: `请${config.type === 'select' ? '选择' : '输入'}${config.label}`
              }
            ]}
          >
            {renderConfigItem(config)}
          </Form.Item>
        ))}
      </Form>
    </div>
  );
};

export default ConfigPanel;