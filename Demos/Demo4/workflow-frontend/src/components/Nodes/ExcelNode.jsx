import React from 'react';
import { Handle } from 'reactflow';
import { Card } from 'antd';
import styled from 'styled-components';

const ExcelNodeWrapper = styled(Card)`
  background: #f6ffed;
  border: 2px solid #52c41a;
  min-width: 200px;
`;

const ExcelNode = ({ data }) => {
  return (
    <ExcelNodeWrapper title="Excel处理">
      <Handle
        type="target"
        position="left"
        style={{ background: '#52c41a' }}
        isConnectable={true}
      />
      
      <div style={{ padding: '8px' }}>
        <div>操作: {data?.operation || '未设置'}</div>
        <div>文件: {data?.filename || '未设置'}</div>
      </div>
      
      <Handle
        type="source"
        position="right"
        style={{ background: '#52c41a' }}
        isConnectable={true}
      />
    </ExcelNodeWrapper>
  );
};

export default ExcelNode;