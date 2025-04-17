import ExcelNode from './ExcelNode';
import WordNode from './WordNode';
import startNode from './Start';
import printNode from './printNode';
import LoopNode from './LoopNode';
export const nodeTypes = {
  excel: ExcelNode,
  word: WordNode,
  start: startNode,
  print: printNode,
  loop: LoopNode,
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
  },

  start: {
    type:'start',
    label: 'start节点',
    configs: [] 
  },

  print:{
    type: 'print',
    label: 'print操作',
    configs: [
      { key: 'content', label: '内容', type: 'input' },
    ]
  },
  loop:{
    type: 'loop',
    label: '循环节点',
    configs: [
      { key: 'Loopcnt', label: '循环次数', type: 'input' },
    ]
  }



  
};