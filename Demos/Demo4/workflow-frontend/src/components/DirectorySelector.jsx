import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';

const DirectorySelector = ({ value, onChange }) => {
  const [selectedPath, setSelectedPath] = useState(value || '');

  const handleDirectorySelect = async () => {
    try {
      if (window.electron) {
        const result = await window.electron.openDirectory();
        if (!result.canceled && result.dirPath) {
          setSelectedPath(result.dirPath);
          onChange(result.dirPath);
          message.success(`已选择文件夹: ${result.dirPath}`);
        }
      } else {
        // 在非Electron环境下使用浏览器的文件夹选择器（如果支持）
        try {
          const dirHandle = await window.showDirectoryPicker();
          const dirPath = dirHandle.name; // 这里只能获取文件夹名称
          setSelectedPath(dirPath);
          onChange(dirPath);
          message.success(`已选择文件夹: ${dirPath}`);
        } catch (error) {
          message.warning('当前环境不支持文件夹选择，请直接输入路径');
        }
      }
    } catch (error) {
      message.error('文件夹选择失败: ' + error.message);
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
        readOnly
        placeholder="请选择输出文件夹"
        style={{ flex: 1 }}
      />
      <Button
        icon={<FolderOpenOutlined />}
        onClick={handleDirectorySelect}
        type="primary"
      >
        浏览
      </Button>
    </div>
  );
};

export default DirectorySelector; 