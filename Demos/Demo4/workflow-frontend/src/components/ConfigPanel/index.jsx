import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Select, Space } from 'antd';
import { nodeConfigs } from '../Nodes';
import FileSelector from '../FileSelector';
import DirectorySelector from '../DirectorySelector';
import styled from 'styled-components';

const { TextArea } = Input;
const { Option } = Select;

const ConfigPanelWrapper = styled(Card)`
  width: 300px;
  height: 100%;
  position: fixed;
  right: 0;
  top: 0;
  border-radius: 0;
  overflow-y: auto;
`;

const ConfigPanel = ({ selectedNode, onConfigChange }) => {
  const [form] = Form.useForm();
  const [operation, setOperation] = useState(selectedNode?.data?.operation || null);
  const [outputMode, setOutputMode] = useState(selectedNode?.data?.outputMode || 'inplace');

  // 当选中节点改变时，重置表单和状态
  useEffect(() => {
    if (selectedNode) {
      form.setFieldsValue(selectedNode.data || {});
      setOperation(selectedNode.data?.operation || null);
      setOutputMode(selectedNode.data?.outputMode || 'inplace');
    } else {
      form.resetFields();
      setOperation(null);
      setOutputMode('inplace');
    }
  }, [selectedNode?.id, form]);

  if (!selectedNode) {
    return (
      <ConfigPanelWrapper title="配置面板">
        <div>请选择一个节点进行配置</div>
      </ConfigPanelWrapper>
    );
  }

  const nodeConfig = nodeConfigs[selectedNode.type];
  if (!nodeConfig) {
    return (
      <ConfigPanelWrapper title="配置面板">
        <div>不支持的节点类型</div>
      </ConfigPanelWrapper>
    );
  }

  const handleValueChange = (changedValues, allValues) => {
    if (changedValues.operation) {
      setOperation(changedValues.operation);
      // 清除操作相关的字段
      const newValues = { ...allValues };
      delete newValues.content;
      delete newValues.searchText;
      delete newValues.replaceText;
      form.setFieldsValue(newValues);
      onConfigChange(newValues);
    } else if (changedValues.outputMode) {
      setOutputMode(changedValues.outputMode);
      if (changedValues.outputMode === 'inplace') {
        const newValues = { ...allValues };
        delete newValues.outputDir;
        form.setFieldsValue(newValues);
        onConfigChange(newValues);
      }
    } else {
      onConfigChange(allValues);
    }
  };

  // 根据当前操作类型返回需要显示的配置项
  const getVisibleConfigs = () => {
    const baseConfigs = nodeConfig.configs.filter(config => {
      // 始终显示文件选择和操作类型选择
      if (config.key === 'filename' || config.key === 'operation') {
        return true;
      }

      // 如果有操作类型，则根据操作类型显示相应的配置项
      if (operation) {
        // 对于需要修改文件的操作，显示输出模式选择
        if (config.key === 'outputMode' && 
            ['write', 'append', 'replace', 'delete'].includes(operation)) {
          return true;
        }

        // 如果选择了输出到新文件，显示输出目录选择
        if (config.key === 'outputDir' && outputMode === 'new') {
          return true;
        }

        // 根据操作类型显示特定的配置项
        switch (operation) {
          case 'write':
          case 'append':
            return config.key === 'content';
          case 'replace':
            return config.key === 'searchText' || config.key === 'replaceText';
          default:
            return false;
        }
      }

      return false;
    });

    return baseConfigs;
  };

  const renderConfigField = (config) => {
    switch (config.type) {
      case 'file':
        return (
          <Form.Item key={config.key} label={config.label} name={config.key}>
            <FileSelector />
          </Form.Item>
        );
      case 'directory':
        return (
          <Form.Item key={config.key} label={config.label} name={config.key}>
            <DirectorySelector />
          </Form.Item>
        );
      case 'input':
        return (
          <Form.Item key={config.key} label={config.label} name={config.key}>
            <Input placeholder={`请输入${config.label}`} />
          </Form.Item>
        );
      case 'textarea':
        return (
          <Form.Item key={config.key} label={config.label} name={config.key}>
            <TextArea
              placeholder={`请输入${config.label}`}
              rows={4}
            />
          </Form.Item>
        );
      case 'select':
        return (
          <Form.Item key={config.key} label={config.label} name={config.key}>
            <Select
              style={{ width: '100%' }}
              placeholder={`请选择${config.label}`}
            >
              {config.options.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return (
    <ConfigPanelWrapper title={`${nodeConfig.label}配置`}>
      <Form
        form={form}
        layout="vertical"
        initialValues={selectedNode.data}
        onValuesChange={handleValueChange}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {getVisibleConfigs().map(renderConfigField)}
        </Space>
      </Form>
    </ConfigPanelWrapper>
  );
};

export default ConfigPanel;