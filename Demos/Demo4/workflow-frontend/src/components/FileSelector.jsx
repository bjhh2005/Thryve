import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';

const FileSelector = ({ value, onChange }) => {
  const [selectedPath, setSelectedPath] = useState(value || '');

  const handleFileSelect = async () => {
    try {
      // 检查是否在Electron环境中
      if (window.electron) {
        // 使用electron的dialog来选择文件
        const result = await window.electron.openFile({
          filters: [
            { name: '所有支持的文件', extensions: ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'xlsx', 'csv'] },
            { name: '文本文件', extensions: ['txt'] },
            { name: '图片文件', extensions: ['png', 'jpg', 'jpeg'] },
            { name: 'PDF文件', extensions: ['pdf'] },
            { name: '数据文件', extensions: ['xlsx', 'csv'] }
          ],
          properties: ['openFile']
        });

        if (result.filePath) {
          setSelectedPath(result.filePath);
          onChange(result.filePath);
          message.success(`已选择文件: ${result.filePath}`);
        }
      } else {
        // 在浏览器环境中使用原生文件选择器
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.pdf,.png,.jpg,.jpeg,.xlsx,.csv';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const filePath = file.path || file.name;
            setSelectedPath(filePath);
            onChange(filePath);
            message.success(`已选择文件: ${filePath}`);
          }
        };
        input.click();
      }
    } catch (error) {
      message.error('文件选择失败: ' + error.message);
    }
  };

  const handlePathChange = (e) => {
    const newPath = e.target.value;
    setSelectedPath(newPath);
    onChange(newPath);
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Input
        value={selectedPath}
        onChange={handlePathChange}
        placeholder="请选择文件或输入文件路径"
        style={{ flex: 1 }}
      />
      <Button
        icon={<FolderOpenOutlined />}
        onClick={handleFileSelect}
        type="primary"
      >
        浏览
      </Button>
    </div>
  );
};

export default FileSelector; 