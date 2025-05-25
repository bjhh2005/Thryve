import React from 'react';
import { Handle } from 'reactflow';
import { Card } from 'antd';
import styled from 'styled-components';

const NodeWrapper = styled(Card)`
  min-width: 200px;
  background: ${props => props.nodeType === 'image' ? '#e6f7ff' :
    props.nodeType === 'pdf' ? '#fff1f0' :
    props.nodeType === 'data' ? '#f6ffed' : '#fff'};
`;

const FileProcessorNode = ({ data, type }) => {
  return (
    <NodeWrapper
      title={`${type.toUpperCase()}处理节点`}
      nodeType={type}
    >
      <Handle
        type="target"
        position="left"
        style={{ background: '#555' }}
        isConnectable={true}
      />
      
      <div style={{ padding: '8px' }}>
        <div>操作: {data?.operation || '未设置'}</div>
        <div>文件: {data?.filename || '未设置'}</div>
      </div>
      
      <Handle
        type="source"
        position="right"
        style={{ background: '#555' }}
        isConnectable={true}
      />
    </NodeWrapper>
  );
};

export default FileProcessorNode; 