import React from 'react';
import { Card, Input } from 'antd';
import { Handle, useReactFlow } from 'reactflow';

const WordNode = ({ id, data }) => {
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
      title="Word操作"
      className="node file-node">
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
        <label>内容：</label>
        <Input.TextArea
          value={data.content}
          onChange={(e) => updateNodeData('content', e.target.value)}
          placeholder="输入内容"
          autoSize
        />
      </div>

      <Handle type="source" position="right" />
    </Card>
  );
};

export default WordNode;
