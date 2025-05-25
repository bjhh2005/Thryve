# README-demo4

## 项目目录介绍

```
workflow-project/
│
├── workflow-frontend/          # 前端项目
│   ├── public/
│   ├── src/
│   │   ├── components/        # 组件目录
│   │   │   ├── Nodes/        # 节点组件
│   │   │   │   ├── BasicNodes/  			#基本块
│   │   │   │   │   ├──OperationNode.jsx
│   │   │   │   │   ├──PrintNode.jsx
│   │   │   │   │   ├──StartNode.jsx
│   │   │   │   ├── FileNodes/				#文件块
│   │   │   │   │   ├──ExcelNode.jsx	
│   │   │   │   │   ├──WordNode.jsx
│   │   │   │   ├── ContorlNodes/			#控制块
│   │   │   │   │   ├──BranchNode.jsx
│   │   │   │   │   ├──LoopNode.jsx
│   │   │   │   ├── configs/				#配置文件
│   │   │   │   │   ├──BasicNodeConfigs.js
│   │   │   │   │   ├──ControlNodeConfigs.js
│   │   │   │   │   ├──FileNodeConfigs.js
│   │   │   │   ├── nodeTypes/				#节点渲染
│   │   │   │   │   ├──BasicNodeTypes.js
│   │   │   │   │   ├──ControlNodeTypes.js
│   │   │   │   │   ├──FileNodeTypes.js
│   │   │   │   └── index.js
│   │   │   ├── Toolbar.jsx   # 工具栏组件
│   │   │   ├── OutputConsole.jsx    # 控制台组件
│   │   │   └── WorkflowControls.jsx # 控制按钮
│   │   ├── services/         # 服务层
│   │   │   └── api.js       # API请求
│   │   ├── styles/          # 样式文件
│   │   │   └── index.css
│   │   ├── App.jsx          # 主应用组件
│   │   └── index.js         # 入口文件
│   ├── images               # 项目图片
│   ├── package.json
│   └── README.md
│
├── workflow-backend/          # 后端项目
│   ├── venv/                 # Python虚拟环境
│   ├── workflows/            # 工作流模块
│   │   ├── __init__.py
│   │   ├── executor.py      # 工作流执行器
│   │   └── nodes/           # 节点实现
│   │       ├── __init__.py
│   │       ├── excel_node.py
│   │       └── word_node.py
│   ├── app.py               # Flask应用入口
│   └── requirements.txt      # Python依赖
│
└── README.md                 # 项目说明文档
```

## 版本更新内容与待完善内容

版本更新内容：

1.对节点的类型控制做了综合和统一化，为节点的后续开发提供了规范

2.完成了项目界面的初步设计与实现

3.完善了前后端通信规范

4.完善了控制台的显示与逻辑

待完善内容：

1.节点之间的连接逻辑仍未规范

2.文件块、变量块的设计仍未确定

3.拖拽节点不能准确定位

4.节点输入框不能鼠标拖动全选

5.工作区的按键功能还未开发

## Node

react-flow库中node节点的数据结构

```jsx
{
  id: '1',                 // 必须：节点的唯一ID
  type: 'start',            // 可选：节点类型，关联nodeTypes
  position: { x: 250, y: 5 }, // 必须：节点在画布上的坐标（左上角为(0,0)）
  data: {                   // 必须：传给节点组件的参数（props）
    label: '我是一个节点',
    otherInfo: '可以自定义更多字段'
  },
  width: 150,               // 可选：节点的宽度（一般自动生成）
  height: 60,               // 可选：节点的高度（一般自动生成）
  selected: false,          // 可选：是否被选中
  dragging: false,          // 可选：是否正在拖拽
  deletable: true,          // 可选：是否允许删除
  draggable: true,          // 可选：是否允许拖动
  selectable: true,         // 可选：是否允许选中
  connectable: true,        // 可选：是否允许连线
  focusable: true,          // 可选：是否可以通过键盘聚焦
  parentNode: 'parent-id',  // 可选：如果这是嵌套节点，指向父节点ID
  extent: 'parent',         // 可选：如果是子节点，限制只能在父节点区域内移动
}

```

node里面的data字段是前后端通信的关键字段

## NodeType

示例：BasicNodeTypes.js

```jsx
import StartNode from '../BasicNodes/StartNode';
import PrintNode from '../BasicNodes/PrintNode';
import OperationNode from '../BasicNodes/OperationNode';

export const BasicNodeTypes = {
    start: StartNode,
    print: PrintNode,
    operation: OperationNode,
};
```

NodeType的作用就是，如果节点的type为start，就用StartNode来渲染该节点

在App.jsx中

```jsx
import { nodeTypes } from './components/Nodes';
....
<ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            preventScrolling={false}
            onNodeClick={(e) => e.stopPropagation()} 
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes} /* 这里进行了nodeTypes属性的传输 */
            deleteKeyCode={['Delete', 'Backspace']} 
            isValidConnection={isValidConnection} 
            fitView
          >
....
```

通过传入nodeTypes提供了一个映射表，每一个nodes数据里的节点，都有一个type字段，通过这个映射表就可以直接查找到节点需要被渲染的具体节点

## NodeConfig

示例：BasicNodeConfigs

```jsx
export const BasicNodeConfigs = {
    start: {
        type: 'start',
        label: 'Start',
        category: '基本块',
        configs: [],
    },
    print: {
        type: 'print',
        label: 'Print',
        category: '基本块',
        configs: [
            { key: 'text', label: '输出文本', type: 'input' },
        ],
    },
    operation: {
        type: 'operation',
        label: '运算块',
        category: '基本块',
        configs: [
            {
                key: 'operator', label: '运算符', type: 'select',
                options: [
                    { value: '加', label: '加法' },
                    { value: '减', label: '减法' },
                    { value: '乘', label: '乘法' },
                    { value: '除', label: '除法' },
                    { value: '取模', label: '取模' },
                ]
            },
            { key: 'leftOperand', label: '左操作数', type: 'input' },
            { key: 'rightOperand', label: '右操作数', type: 'input' },
        ]
    },
};
```

config节点属性说明：

- type:节点的类型标识
- label:节点的显示名字
- category:节点的分类
- configs:节点自定义参数配置项

type是为了在逻辑层面对节点进行区分的属性，而label是在前端界面给用户展示的名称

**配置阶段**：config 定义了节点需要哪些参数，以及这些参数的输入类型和标签。

**运行阶段**：data 存储了用户为这些参数实际输入的值



## 如何添加新的功能节点？

1.在对应的节点目录（基本、文件、控制）编写相应Node.jsx代码

2.在config目录下对应的文件（基本、文件、控制）对功能节点进行注册

```jsx
print: {
        type: 'print',
        label: 'Print',
        category: '基本块',
        configs: [
            { key: 'text', label: '输出文本', type: 'input' },
        ],
    },
```

3.在nodetype目录下对应的文件（基本、文件、控制）对功能节点进行注册

```jsx
export const BasicNodeTypes = {
    start: StartNode,
    print: PrintNode,
};
```

> 对于2，3里面的操作，相应js文件VS一般会自动进行节点的导入，如果没有自动导入，需要手动进行导入；
>
> ```js
> //BasicNodeTypes.js
> 
> import StartNode from '../BasicNodes/StartNode';
> import PrintNode from '../BasicNodes/PrintNode';
> import OperationNode from '../BasicNodes/OperationNode';
> //上面都是导入相应节点
> 
> export const BasicNodeTypes = {
>     start: StartNode,
>     print: PrintNode,
>     operation: OperationNode,
> };
> ```

4.保证在Node.jsx里面规定的Node的data字段里面的属性名称与后端一致

```jsx
import React from 'react';
import { Card, Input } from 'antd';
import { Handle, useReactFlow } from 'reactflow';

const PrintNode = ({ id, data }) => {
    const { setNodes } = useReactFlow(); // 用reactflow提供的方法修改节点

    const handleTextChange = (e) => {
        const newText = e.target.value;

        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            content: newText, // 更新data.text
                        },
                    };
                }
                return node;
            })
        );
    };

    return (
        <Card
            title="Print"
            className="node basic-node print"
        >
            <Handle type="target" position="left" />
            <p>打印内容：</p>
            <Input
                value={data.content || ''} // 绑定data.text
                onChange={handleTextChange} // 输入时更新data.text
                placeholder="请输入打印内容"
                size="small"
            />
            <Handle type="source" position="right" />
        </Card>
    );
};

export default PrintNode;
```

比如在上面PrintNode.jsx的代码中，添加data的字段名称是:content

```jsx
setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            content: newText, // 更新data.text
                        },
                    };
                }
                return node;
            })
        );
    };
```

一定要保证content这个属性的名称与后端一致

## 配置与启动项目

### 后端设置

```bash
# 创建并进入项目目录
cd workflow-backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 安装依赖
pip install flask flask-cors pandas openpyxl python-docx Pillow
```

### 前端设置

```bash
# 进入前端项目目录
cd workflow-frontend

# 安装依赖
npm install
```

### 启动应用

1. 启动后端服务

```bash
cd workflow-backend
python app.py
```

2. 启动前端服务

```bash
cd workflow-frontend
npm start
```

