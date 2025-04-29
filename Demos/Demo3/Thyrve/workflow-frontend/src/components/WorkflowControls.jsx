import React from 'react';
import { Button, Upload, message } from 'antd';
import { SaveOutlined, UploadOutlined, PlayCircleOutlined } from '@ant-design/icons';

const WorkflowControls = ({ onStart, onSave, onLoad }) => {
  return (
    <div className="workflow-controls">
      <Button 
        type="primary" 
        icon={<PlayCircleOutlined />} 
        onClick={onStart}
      >
        开始执行
      </Button>
      <Button 
        icon={<SaveOutlined />} 
        onClick={onSave}
      >
        保存流程
      </Button>
      <Upload 
        accept='.json'
        showUploadList={false}
        beforeUpload={(file) => {
          onLoad(file);
          return false;
        }}
      >
        <Button icon={<UploadOutlined />}>加载流程</Button>
      </Upload>
    </div>
  );
};

export default WorkflowControls;