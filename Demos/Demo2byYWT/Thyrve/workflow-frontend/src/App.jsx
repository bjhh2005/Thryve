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
import OutputConsole from './components/OutputConsole';  // 新增


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

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);


  // 不要使用自定义的删除功能
  // // 添加键盘删除功能
  // const onKeyDown = useCallback((event) => {
  //   if (event.key === 'Delete') {

  //     const selectedNodes = nodes.filter(node => node.selected);
  //     const selectedEdges = edges.filter(edge => edge.selected);

  //     if (selectedNodes.length > 0 || selectedEdges.length > 0) {
  //       setNodes(nodes.filter(node => !node.selected));
  //       setEdges(edges.filter(edge => !edge.selected));
  //       message.info('已删除选中的项目');
  //     }
  //   }
  // }, [nodes, edges, setNodes, setEdges]);

  const handleStart = async () => {
    try {
      window.Log('开始执行', 'info');
      // 获取全部的节点 准备发送
      const workflow = { nodes, edges };
      const result = await executeWorkflow(workflow);
      // 值的一提 这里的result是个response对象 其构成为
      // {
      //   data: {
      //     .....
      //   },
      //   status: 200,
      //   statusText: 'OK',
      //   headers: {...},
      //   config: {...},
      //   request: {...}
      // }
      // data里面才是返回的结果 其他的都是自动的处理
      // 比如我python里面返回的是return jsonify({"status": "success", "data": result})
      // 那么这里的result就是的 data：{{"status": "success", "data": result}}
      console.log(result)
      if (result.data["status"] === 'error') {
        window.Log(`执行失败: ${result.data["message"]}`, 'error');
      } else {
        window.Log(`执行成功`, 'info');
        // 遍历 result.data["data"] 数组并打印每个元素的第二个值
        result.data["data"].forEach(item => {
          for (let key in item) {
            if (item.hasOwnProperty(key)) {
                window.Log(`${key}: ${item[key]}`, 'info');
            }
          }
        });
      }
    } catch (error) {
      // 这里一般是不会调用的 如果发生了 说明代码出错了 或者接口返回了错误
      // 因为返回值中是存在status字段的
      window.Log(`执行失败: ${error.message}`, 'error');
      window.Log(`错误详情: ${error.response?.data}`, 'error');
    }
  };


  /////////////////////////////////////////////////////////////////
  // Zhang Ruixin added this code to validate the connection
  // 设计了一个兼容表 
  // 如果类型相同 那么可以连接
  // 否则不能连接
  // 后续解决可能需要使用正则表达式

  const validConnectionMap = {
    'workflow_output': ['workflow_input'],
    'workflow_input': ['workflow_output'],
    'workflow_output_loopbody': ['workflow_input'],
  };
  const isValidConnection = useCallback(
    ({ source, target, sourceHandle, targetHandle }) => {
      // window.Log(`source: ${source}, target: ${target}, sourceHandle: ${sourceHandle}, targetHandle: ${targetHandle}`, 'info');

      // 如果不匹配 那么直接删除
      if (!validConnectionMap[sourceHandle]?.includes(targetHandle)) {
        return false;
      }
      // 对于workflow_output 不能重复连接 但是workflow_input也许可以重复连接
      const targetAlreadyConnected = edges.some(
        edge => edge.source === source
          && edge.sourceHandle === 'workflow_output'
      );
      return !targetAlreadyConnected;
    },
    [edges]
  );

  /////////////////////////////////////////////////////////////////



  return (
    <div
      className="app-container"
      tabIndex={0}
    // 使用原生的API方便调用
    // onKeyDown={onKeyDown}
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
          deleteKeyCode={['Delete']} // 支持Delete和Backspace键删除
          /////////////////////////////////////////////////////////////////

          // zhang ruixin added this code to validate the connection

          isValidConnection={isValidConnection}
        /////////////////////////////////////////////////////////////////
        >
          <Background />
          <Controls />
        </ReactFlow>
        <OutputConsole />
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