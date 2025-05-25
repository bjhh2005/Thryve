import React, { memo, useCallback } from 'react';
import { Handle } from 'reactflow';
import { Card } from 'antd';
import { useNodeStore } from '../stores/nodeStore';

const CustomNode = memo(({ id, data, type, selected }) => {
  const { setSelectedNode } = useNodeStore();

  const handleClick = useCallback(() => {
    setSelectedNode(id);
  }, [id, setSelectedNode]);

  const nodeStyle = {
    padding: '10px',
    borderRadius: '5px',
    minWidth: '150px',
    backgroundColor: 'white',
    border: selected ? '2px solid #1890ff' : '1px solid #d9d9d9',
    boxShadow: selected ? '0 0 10px rgba(24,144,255,0.5)' : 'none',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={nodeStyle} onClick={handleClick}>
      <Handle
        type="target"
        position="left"
        style={{ background: '#555' }}
      />
      <Card
        size="small"
        title={data.label}
        style={{ border: 'none', background: 'transparent' }}
      >
        <div style={{ fontSize: '12px', color: '#666' }}>
          {data.description || type}
        </div>
        {data.status && (
          <div style={{
            marginTop: '8px',
            padding: '4px',
            backgroundColor: data.status === 'success' ? '#f6ffed' : '#fff2f0',
            borderRadius: '2px',
            fontSize: '12px',
            color: data.status === 'success' ? '#52c41a' : '#ff4d4f'
          }}>
            {data.status === 'success' ? '执行成功' : '执行失败'}
          </div>
        )}
      </Card>
      <Handle
        type="source"
        position="right"
        style={{ background: '#555' }}
      />
    </div>
  );
});

export default CustomNode; 