import React, { useState, useEffect, useRef } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const OutputConsole = () => {
  const [logs, setLogs] = useState([]);
  const bottomRef = useRef(null);

  const Log = (message, type = "info") => {
    let formattedMessage = "";

    if (typeof message === 'object' && message !== null) {
      try {
        formattedMessage = JSON.stringify(message, null, 2);
      } catch (e) {
        formattedMessage = String(message);
      }
    } else if (message === null || message === undefined) {
      formattedMessage = String(message);
    } else {
      formattedMessage = message;
    }

    const logEntry = {
      id: `${Date.now()}-${Math.random()}`,
      message: formattedMessage,
      type
    };
    console.log('Adding log:', logEntry); // 调试输出
    setLogs(prevLogs => [...prevLogs, logEntry]);
  };

  useEffect(() => {
    window.Log = Log;
    return () => {
      delete window.Log;
    };
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);


  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'red';
      case 'warning': return 'orange';
      case 'info': return 'blue';
      default: return 'black';
    }
  };

  return (
    <div>
      {logs.map(log => (
        <div key={log.id} style={{ marginBottom: '5px' }}>
          <Text strong style={{ color: getLogColor(log.type) }}>
            [{log.type.toUpperCase()}]
          </Text>
          <Text
            className='console-text'
          >
            {log.message}
          </Text>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default OutputConsole;
