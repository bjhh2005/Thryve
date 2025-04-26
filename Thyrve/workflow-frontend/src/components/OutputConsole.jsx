import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const OutputConsole = () => {
  const [logs, setLogs] = useState([]);

  // 全局Log函数，可以在其他组件中调用
  const Log = (message, type = "info") => {
    const logEntry = {
      id: Date.now(),
      message,
      type
    };
    setLogs(prevLogs => [...prevLogs, logEntry]);
  };

  // 将Log函数挂载到全局window对象，使其可以在其他组件中访问
  useEffect(() => {
    window.Log = Log;
    return () => {
      delete window.Log;
    };
  }, []);

  const getLogColor = (type) => {
    switch(type) {
      case 'error': return 'red';
      case 'warning': return 'orange';
      case 'info': return 'blue';
      default: return 'black';
    }
  };

  return (
    <div 
      className="output-console" 
      style={{
        height: '200px', 
        backgroundColor: '#f0f0f0', 
        overflowY: 'auto', 
        padding: '10px',
        borderTop: '1px solid #ddd'
      }}
    >
      {logs.map(log => (
        <div key={log.id} style={{ marginBottom: '5px' }}>
          <Text strong style={{ color: getLogColor(log.type) }}>
            [{log.type.toUpperCase()}] {log.message}
          </Text>
        </div>
      ))}
    </div>
  );
};

export default OutputConsole;