// add By Zhang Ruixin

import React from 'react';
import { Handle } from 'reactflow';
import { Card } from 'antd';
import styled from 'styled-components';

const StartNodeWrapper = styled(Card)`
  background: #e6f7ff;
  border: 2px solid #1890ff;
  min-width: 150px;
`;

const StartNode = () => {
  return (
    <StartNodeWrapper title="开始节点">
      <Handle
        type="source"
        position="right"
        style={{ background: '#1890ff' }}
        isConnectable={true}
      />
    </StartNodeWrapper>
  );
};

export default StartNode;