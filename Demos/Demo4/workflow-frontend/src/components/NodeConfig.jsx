import React from 'react';
import { Form, Input, Select, InputNumber, Button, Space, Divider } from 'antd';
import FileSelector from './FileSelector';

const { TextArea } = Input;
const { Option } = Select;

const NodeConfig = ({ node, onChange }) => {
  const [form] = Form.useForm();

  const handleChange = (changedValues, allValues) => {
    onChange({
      ...node,
      data: {
        ...node.data,
        ...allValues
      }
    });
  };

  const renderTextOperationFields = () => {
    const operation = form.getFieldValue('operation');
    switch (operation) {
      case 'write':
      case 'append':
        return (
          <Form.Item name="content" label="写入内容">
            <TextArea rows={4} placeholder="请输入要写入的内容" />
          </Form.Item>
        );
      case 'replace':
        return (
          <>
            <Form.Item name="searchText" label="查找文本">
              <Input placeholder="请输入要查找的文本" />
            </Form.Item>
            <Form.Item name="replaceText" label="替换为">
              <Input placeholder="请输入要替换的文本" />
            </Form.Item>
          </>
        );
      case 'delete':
        return (
          <Form.Item name="deletePattern" label="删除包含">
            <Input placeholder="请输入要删除的行包含的文本" />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  const renderImageOperationFields = () => {
    const operation = form.getFieldValue('operation');
    if (operation === 'crop') {
      return (
        <>
          <Form.Item label="裁剪区域" style={{ marginBottom: 0 }}>
            <Space>
              <Form.Item name={['crop_area', 0]} label="X">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item name={['crop_area', 1]} label="Y">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item name={['crop_area', 2]} label="宽">
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item name={['crop_area', 3]} label="高">
                <InputNumber min={1} />
              </Form.Item>
            </Space>
          </Form.Item>
        </>
      );
    }
    return null;
  };

  const renderDataOperationFields = () => {
    const operation = form.getFieldValue('operation');
    switch (operation) {
      case 'excel_extract':
        return (
          <Form.Item name="sheet_name" label="工作表名">
            <Input placeholder="留空则读取第一个工作表" />
          </Form.Item>
        );
      case 'csv_transform':
        return (
          <>
            <Form.Item name="encoding" label="编码">
              <Select defaultValue="utf-8">
                <Option value="utf-8">UTF-8</Option>
                <Option value="gbk">GBK</Option>
                <Option value="ascii">ASCII</Option>
              </Select>
            </Form.Item>
            <Form.Item name="separator" label="分隔符">
              <Input placeholder="默认为逗号" />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  const getOperationOptions = () => {
    switch (node.type) {
      case 'text':
        return [
          { label: '读取文本', value: 'read' },
          { label: '写入文本', value: 'write' },
          { label: '替换文本', value: 'replace' },
          { label: '删除行', value: 'delete' },
          { label: '追加文本', value: 'append' }
        ];
      case 'image':
        return [
          { label: '通道分离', value: 'channel_split' },
          { label: '裁剪图像', value: 'crop' }
        ];
      case 'pdf':
        return [
          { label: '分割页面', value: 'split' },
          { label: '提取文本', value: 'extract_text' }
        ];
      case 'data':
        return [
          { label: '提取Excel', value: 'excel_extract' },
          { label: '转换CSV', value: 'csv_transform' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="node-config" style={{ padding: '16px' }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={node.data}
        onValuesChange={handleChange}
      >
        <Form.Item name="filename" label="输入文件">
          <FileSelector />
        </Form.Item>

        <Form.Item name="operation" label="操作类型">
          <Select options={getOperationOptions()} />
        </Form.Item>

        <Divider />

        {node.type === 'text' && renderTextOperationFields()}
        {node.type === 'image' && renderImageOperationFields()}
        {node.type === 'data' && renderDataOperationFields()}
      </Form>
    </div>
  );
};

export default NodeConfig; 