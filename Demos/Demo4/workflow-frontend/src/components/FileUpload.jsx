import React, { useState } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const FileUpload = () => {
  const [fileList, setFileList] = useState([]);

  const props = {
    name: 'file',
    action: '/api/upload',
    fileList,
    onChange(info) {
      let newFileList = [...info.fileList];
      
      // 限制只显示最新上传的文件
      newFileList = newFileList.slice(-1);
      
      // 更新文件状态
      newFileList = newFileList.map(file => {
        if (file.response) {
          file.url = file.response.filepath;
        }
        return file;
      });
      
      setFileList(newFileList);
      
      // 处理上传状态
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    accept: '.txt,.pdf,.png,.jpg,.jpeg,.xlsx,.csv',
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />} type="primary">
        选择文件上传
      </Button>
    </Upload>
  );
};

export default FileUpload; 