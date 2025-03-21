import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { message } from 'antd';
import { nodeTypes } from './components/Nodes';
import Toolbar from './components/Toolbar';
import ConfigPanel from './components/ConfigPanel';
import WorkflowControls from './components/WorkflowControls';
import { executeWorkflow } from './services/api';
import 'reactflow/dist/style.css';
import './styles/index.css';

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);


  // 保存流程
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

  // 加载流程
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


  // 处理节点删除
  const onNodesDelete = useCallback((nodesToDelete) => {
    // 可以在这里添加删除前的确认逻辑
    message.success('节点已删除');
  }, []);

  // 处理连线删除
  const onEdgesDelete = useCallback((edgesToDelete) => {
    message.success('连线已删除');
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

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

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  // 添加键盘删除功能
  const onKeyDown = useCallback((event) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const selectedNodes = nodes.filter(node => node.selected);
      const selectedEdges = edges.filter(edge => edge.selected);

      if (selectedNodes.length > 0 || selectedEdges.length > 0) {
        setNodes(nodes.filter(node => !node.selected));
        setEdges(edges.filter(edge => !edge.selected));
        message.info('已删除选中的项目');
      }
    }
  }, [nodes, edges, setNodes, setEdges]);

  const handleStart = async () => {
    try {
        console.log('开始执行工作流');
        console.log('节点配置:', nodes);
        console.log('连线配置:', edges);
        
        const workflow = { nodes, edges };
        const result = await executeWorkflow(workflow);
        
        console.log('执行结果:', result);
        if (result.status === 'success') {
            message.success('工作流执行成功，请查看生成的文档');
        } else {
            console.warn('执行完成但可能有警告:', result);
            message.warning('工作流执行完成，但可能有警告');
        }
    } catch (error) {
        console.error('执行错误:', error);
        console.error('错误详情:', error.response?.data);
        message.error(`执行失败: ${error.message}`);
    }
};

  return (
    <div 
      className="app-container" 
      tabIndex={0} 
      onKeyDown={onKeyDown}
    >
      <Toolbar />
      <div className="workflow-area">
        <WorkflowControls
          onStart={handleStart}
          onSave={handleSave}
          onLoad={handleLoad}
        />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          deleteKeyCode={['Delete', 'Backspace']} // 支持Delete和Backspace键删除
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <ConfigPanel
        selectedNode={selectedNode}
        onConfigChange={(config) => {
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === selectedNode?.id) {
                node.data = { ...node.data, ...config };
              }
              return node;
            })
          );
        }}
      />
    </div>
  );
};

export default App;