import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';
const { Text } = Typography;

// 设置日志上限数量
const MAX_LOGS = 100;

const OutputConsole = () => {
  const [logs, setLogs] = useState([]);

  // 全局Log函数，可以在其他组件中调用
  const Log = (message, type = "info") => {
    const logEntry = {
      id: uuidv4(),
      message,
      type
    };
    setLogs(prevLogs => {
      const newLogs = [...prevLogs, logEntry];
      if (newLogs.length > MAX_LOGS) {
        // 超过最大数量时，丢弃最旧的日志
        return newLogs.slice(newLogs.length - MAX_LOGS);
      }
      return newLogs;
    });
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
