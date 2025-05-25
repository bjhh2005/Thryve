import ExcelNode from './ExcelNode';
import WordNode from './WordNode';
import StartNode from './Start';
import PrintNode from './printNode';
import LoopNode from './LoopNode';
import FileProcessorNode from './FileProcessorNode';
import EndNode from './End';

export const nodeTypes = {
  excel: ExcelNode,
  word: WordNode,
  start: StartNode,
  print: PrintNode,
  loop: LoopNode,
  image: (props) => <FileProcessorNode {...props} type="image" />,
  pdf: (props) => <FileProcessorNode {...props} type="pdf" />,
  data: (props) => <FileProcessorNode {...props} type="data" />,
  text: (props) => <FileProcessorNode {...props} type="text" />,
  end: EndNode,
};

export const nodeConfigs = {
  excel: {
    type: 'excel',
    label: 'Excel操作',
    configs: [
      { key: 'filename', label: '文件', type: 'file' },
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
      { key: 'filename', label: '文件', type: 'file' },
      { key: 'content', label: '内容', type: 'textarea' }
    ]
  },
  start: {
    type: 'start',
    label: '开始节点',
    configs: []
  },
  end: {
    type: 'end',
    label: '结束节点',
    configs: []
  },
  print: {
    type: 'print',
    label: '打印操作',
    configs: [
      { key: 'content', label: '内容', type: 'input' },
    ]
  },
  loop: {
    type: 'loop',
    label: '循环节点',
    configs: [
      { key: 'Loopcnt', label: '循环次数', type: 'input' },
    ]
  },
  image: {
    type: 'image',
    label: '图像处理',
    configs: [
      { key: 'filename', label: '文件', type: 'file' },
      {
        key: 'operation',
        label: '操作',
        type: 'select',
        options: [
          { value: 'channel_split', label: '色道分离' },
          { value: 'crop', label: '裁剪' }
        ]
      },
      {
        key: 'left_top_x',
        label: '左上X',
        type: 'input'
      },
      {
        key: 'left_top_y',
        label: '左上Y',
        type: 'input'
      },
      {
        key: 'right_bottom_x',
        label: '右下X',
        type: 'input'
      },
      {
        key: 'right_bottom_y',
        label: '右下Y',
        type: 'input'
      }
    ]
  },
  pdf: {
    type: 'pdf',
    label: 'PDF处理',
    configs: [
      { key: 'filename', label: '文件', type: 'file' },
      {
        key: 'operation',
        label: '操作',
        type: 'select',
        options: [
          { value: 'split', label: '页面分割' },
          { value: 'extract_text', label: '文本提取' }
        ]
      }
    ]
  },
  data: {
    type: 'data',
    label: '数据文件',
    configs: [
      { key: 'filename', label: '文件', type: 'file' },
      {
        key: 'operation',
        label: '操作',
        type: 'select',
        options: [
          { value: 'excel_extract', label: 'Excel提取' },
          { value: 'csv_transform', label: 'CSV转换' }
        ]
      }
    ]
  },
  text: {
    type: 'text',
    label: '文本处理',
    configs: [
      { key: 'filename', label: '文件', type: 'file' },
      {
        key: 'operation',
        label: '操作',
        type: 'select',
        options: [
          { value: 'write', label: '写入' },
          { value: 'replace', label: '替换' },
          { value: 'append', label: '追加' }
        ]
      },
      {
        key:'content',
        label:'内容',
        type:'textarea'
      },
      {
        key:'searchText',
        label:'查找内容',
        type:'input'
      },
      {
        key:'replaceText',
        label:'替换内容',
        type:'input'
      }
    ]
  }
};