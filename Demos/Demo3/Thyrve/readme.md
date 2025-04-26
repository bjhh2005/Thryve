# 可视化工作流编排系统

一个基于React Flow和Python Flask的可视化工作流编排系统，允许用户通过拖拽方式创建和执行数据处理流程。

## 功能特点

- 可视化流程编排
- Excel数据处理
- Word文档生成
- 工作流保存与加载
- 节点配置管理
- 实时执行反馈

## 技术栈

### 前端
- React
- React Flow (流程图编排)
- Ant Design (UI组件)
- Axios (HTTP请求)

### 后端
- Python Flask
- pandas (数据处理)
- python-docx (Word文档生成)
- openpyxl (Excel文件处理)

## 项目结构

```
workflow-project/
│
├── workflow-frontend/          # 前端项目
│   ├── public/
│   ├── src/
│   │   ├── components/        # 组件目录
│   │   │   ├── Nodes/        # 节点组件
│   │   │   │   ├── ExcelNode.jsx
│   │   │   │   ├── WordNode.jsx
│   │   │   │   └── index.js
│   │   │   ├── Toolbar.jsx   # 工具栏组件
│   │   │   ├── ConfigPanel.jsx # 配置面板
│   │   │   └── WorkflowControls.jsx # 控制按钮
│   │   ├── services/         # 服务层
│   │   │   └── api.js       # API请求
│   │   ├── styles/          # 样式文件
│   │   │   └── index.css
│   │   ├── App.jsx          # 主应用组件
│   │   └── index.js         # 入口文件
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

### 关键文件说明

#### 前端文件
- `ExcelNode.jsx`: Excel节点的实现
- `WordNode.jsx`: Word节点的实现
- `Toolbar.jsx`: 左侧工具栏，包含可拖拽的节点
- `ConfigPanel.jsx`: 右侧配置面板，用于节点参数设置
- `WorkflowControls.jsx`: 顶部控制按钮（执行、保存、加载）
- `api.js`: 后端API调用封装
- `App.jsx`: 主应用逻辑和布局

#### 后端文件
- `app.py`: Flask应用入口，处理API请求
- `executor.py`: 工作流执行引擎
- `excel_node.py`: Excel节点的业务逻辑实现
- `word_node.py`: Word节点的业务逻辑实现

## 开发指南

### 添加新节点类型

1. 前端部分：
```bash
# 在 src/components/Nodes 下创建新节点组件
touch src/components/Nodes/NewNode.jsx

# 在 index.js 中注册节点
export const nodeTypes = {
  excel: ExcelNode,
  word: WordNode,
  new: NewNode,  // 添加新节点
};
```

2. 后端部分：
```bash
# 在 workflows/nodes 下创建新节点处理类
touch workflows/nodes/new_node.py

# 在 executor.py 中注册节点
class WorkflowExecutor:
    def create_node_instance(self, node_data):
        if node_type == 'new':
            return NewNode(node_data['data'])
```

### 自定义节点样式

在 `styles/index.css` 中添加样式：
```css
.new-node {
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}

```

## 安装说明

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

## 启动应用

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

## 使用指南

### 创建工作流

1. 从左侧工具栏拖拽节点到画布
2. 连接节点建立数据流
3. 配置节点参数：
   - Excel节点：
     * filename: Excel文件路径
     * operation: read/sum
   - Word节点：
     * filename: 输出文档路径
     * content: 文档内容

### 节点操作

- 删除节点：选中后按Delete键
- 移动节点：拖拽节点
- 连接节点：拖拽连接点
- 配置节点：点击节点在右侧面板配置

### 工作流管理

- 保存工作流：点击"保存流程"按钮
- 加载工作流：点击"加载流程"按钮
- 执行工作流：点击"开始执行"按钮

## 文件路径说明

使用正斜杠"/"分隔的完整路径，例如：
```
C:/Users/YourName/Documents/data.xlsx
D:/WorkFiles/output.docx
```

## 示例工作流

1. Excel数据处理流程：
```
Excel(read) -> Excel(sum) -> Word
```

2. 简单报告生成：
```
Excel(read) -> Word
```

## 注意事项

1. 确保文件路径正确且有访问权限
2. Excel文件需要提前创建和填充数据
3. Word文档会自动创建或覆盖
4. 保存的工作流为JSON格式

## 错误处理

- 检查文件路径是否正确
- 确认Excel文件格式是否支持
- 查看浏览器控制台错误信息
- 检查后端服务日志
