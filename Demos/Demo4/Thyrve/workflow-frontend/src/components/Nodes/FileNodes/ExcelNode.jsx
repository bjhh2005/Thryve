import React from 'react';
import { Input, Card } from "antd";
import { Handle, useReactFlow } from 'reactflow';

const ExcelNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const updateNodeData = (key, value) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [key]: value } } : node
      )
    );
  };
  return (
    <Card
      title="Excel操作"
      className="node file-node" // 绑定自定义 CSS 类
    >
      <Handle type="target" position="left" />

      <div className='file'>
        <label>文件名：</label>
        <Input
          className='funcInput'
          value={data.filename}
          onChange={(e) => updateNodeData('filename', e.target.value)}
          placeholder="输入文件名"
        />
      </div>

      <div className='handle'>
        <label>操作：</label>
        <select
          value={data.operation}
          onChange={(e) => updateNodeData('operation', e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <option value="read">读取</option>
          <option value="write">写入</option>
          <option value="sum">求和</option>
        </select>
      </div>

      <Handle type="source" position="right" />
    </Card>
  );
};

export default ExcelNode;