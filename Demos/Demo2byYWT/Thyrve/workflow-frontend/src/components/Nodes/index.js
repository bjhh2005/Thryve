import ExcelNode from './ExcelNode';
import WordNode from './WordNode';

export const nodeTypes = {
  excel: ExcelNode,
  word: WordNode,
};

export const nodeConfigs = {
  excel: {
    type: 'excel',
    label: 'Excel操作',
    configs: [
      { key: 'filename', label: '文件名', type: 'input' },
      { 
        key: 'operation', 
        label: '操作', 
        type: 'select',
        options: [
          { value: 'read', label: '读取' },
          { value: 'write', label: '写入' },
          { value: 'sum', label: '求和' },
        ]
      }
    ]
  },
  word: {
    type: 'word',
    label: 'Word操作',
    configs: [
      { key: 'filename', label: '文件名', type: 'input' },
      { key: 'content', label: '内容', type: 'textarea' }
    ]
  }
};