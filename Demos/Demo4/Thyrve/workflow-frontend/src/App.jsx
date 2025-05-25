import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { message, Button } from 'antd';
import { nodeTypes } from './components/Nodes';
import Toolbar from './components/Toolbar';
import WorkflowControls from './components/WorkflowControls';
import { executeWorkflow } from './services/api';
import 'reactflow/dist/style.css';
import './styles/index.css';
import { LeftCircleOutlined, RightCircleOutlined, FormOutlined, LaptopOutlined, SolutionOutlined, SkinOutlined } from '@ant-design/icons';
import OutputConsole from './components/OutputConsole';


const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [consoleVisible, setConsoleVisible] = useState(false);

  const toggleConsole = () => {
    setConsoleVisible(prev => !prev);
  };
  // 保存流程————导入JSON文件
  const handleSave = useCallback(() => {
    try {
      const workflow = {
        nodes,
        edges,
        version: '1.0', // 版本号，方便未来扩展
        savedAt: new Date().toISOString()
      };
      // 创建Blob并下载
      const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workflow-${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success('工作流程已保存');
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败: ' + error.message);
    }
  }, [nodes, edges]);

  // 加载流程————导入JSON文件
  const handleLoad = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target.result);
        // 验证文件格式
        if (!workflow.nodes || !workflow.edges) {
          throw new Error('无效的工作流程文件');
        }
        // 加载节点和连线
        setNodes(workflow.nodes);
        setEdges(workflow.edges);
        message.success('工作流程已加载');
      } catch (error) {
        console.error('加载失败:', error);
        message.error('加载失败: ' + error.message);
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges]);

  // 节点删除逻辑处理
  const onNodesDelete = useCallback((nodesToDelete) => {
    const nodeIdsToDelete = nodesToDelete.map((node) => node.id);
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !nodeIdsToDelete.includes(edge.source) &&
          !nodeIdsToDelete.includes(edge.target)
      )
    );
  }, [setEdges]);

  // 连线删除逻辑处理
  const onEdgesDelete = useCallback((edgesToDelete) => {
  }, []);

  // 连线连接逻辑处理
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // 拖拽上传逻辑处理
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // 节点点击事件处理
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - 200,
        y: event.clientY - 40,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );


  const handleStart = async () => {
    setConsoleVisible(true);

    try {
      window.Log('开始执行', 'info');

      const workflow = { nodes, edges };
      console.log('发送到后端的 workflow:', workflow);
      const result = await executeWorkflow(workflow);

      if (result.data["status"] === 'error') {
        window.Log(`执行失败: ${result.data["message"]}`, 'error');
      } else {
        window.Log(`执行成功`, 'info');
        result.data["data"].forEach(item => {
          for (let key in item) {
            if (item.hasOwnProperty(key)) {
              window.Log(`${key}: ${item[key]}`, 'info');
            }
          }
        });
      }
    } catch (error) {
      window.Log(`执行失败: ${error.message}`, 'error');
      if (error.response?.data) {
        const errorDetail = JSON.stringify(error.response.data, null, 2);
        window.Log(`错误详情: ${errorDetail}`, 'error');
      }
    }
  };



  return (
    <div
      className="app-container"
      tabIndex={0}
    // 使用原生的API方便调用
    //onKeyDown={onKeyDown}
    >
      <div className="top">
        <div className="information-space">
          <div className="project-information">
            <span>项目1.thr</span>
            <span>-Thryve</span>
          </div>
          <div className="search">
            <input type="text" placeholder='搜索' />
          </div>
          <div className="user-information">
            <div className='user-profile'></div>
            {/* <img src="" className="user-profile" /> */}
            <span className="user-name">Calmer</span>
          </div>
          {/* <div className="control-button">
            <button className='hide'></button>
            <button className='full-screen'></button>
            <button className='close'></button>
          </div> */}
        </div>
        <div className="setting-space">
          <div className="left">
            <button className='setting-button'>文件(F)</button>
            <button className='setting-button'>编辑(E)</button>
            <button className='setting-button'>帮助(H)</button>
            <button className='setting-button'>主题(T)</button>
            <button className='setting-button'>...(M)</button>
          </div>
          <div className="right">
            <button className='setting-button'>设置(S)</button>
            <button className='setting-button share'>分享协作</button>
          </div>
        </div>
        <div className="work-space">
          <div className="left">
            <WorkflowControls
              onStart={handleStart}
              onSave={handleSave}
              onLoad={handleLoad}
            />
            <Button
              className='func-button'
              icon={<LeftCircleOutlined />}
            >
            </Button>
            <Button
              className='func-button'
              icon={<RightCircleOutlined />}
            >
            </Button>
            <Button
              className='func-button'
              icon={<FormOutlined />}
            >
            </Button>
            <Button
              className='func-button'
              icon={<LaptopOutlined />}
            >
            </Button>
            <Button
              className='func-button'
              icon={<SolutionOutlined />}
            >
            </Button>
          </div>
          <div className="right">
            <Button
              className='func-button'
              icon={<SkinOutlined />}
            >
            </Button>
          </div>
        </div>
      </div>
      <div className="canva">
        <Toolbar />
        <div className="workflow-area">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            preventScrolling={false}
            onNodeClick={(e) => e.stopPropagation()} // 允许内部元素接收点击
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            deleteKeyCode={['Delete', 'Backspace']} // 支持Delete和Backspace键删除
            // isValidConnection={isValidConnection}  //Zhanng
            fitView
          >
            <MiniMap
              style={
                {
                  border: '1px solid #dfe0e2',
                  borderRadius: '3px'
                }
              }
              nodeColor={(node) => {
                switch (node.type) {
                  case 'word':
                    return '#3b82f6';
                  case 'excel':
                    return '#3b82f6';
                  case 'print':
                    return '#d76969';
                  case 'start':
                    return '#d76969';
                  default:
                    return '#999';
                }
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
            <Background
              id="1"
              variant="lines"
              gap={100}         // 主网格间距
              color="#dbd7d7"  // 主网格颜色
              lineWidth={2}  // 主网格线宽
            />

            <Background
              id="2"
              variant="lines"
              gap={20}         // 辅助网格间距
              color="#f3f3f3"  // 辅助网格颜色
              lineWidth={1.5}  // 辅助网格线宽
            />
            <Controls />
          </ReactFlow>
        </div>
        <div className="bottom-control">
          <Button className="console-toggle-button" onClick={toggleConsole}>
            控制台
            <span className={`arrow ${consoleVisible ? 'up' : 'down'}`}></span>
          </Button>
        </div>
        <div className={`output-console ${consoleVisible ? 'open' : ''}`}>
          <OutputConsole></OutputConsole>
        </div>
      </div>
    </div>
  );
};

export default App;