import logging
from .nodes.excel_node import ExcelNode
from .nodes.word_node import WordNode
from .ReactExection import ReactError
from .NodeFactory import NodeFactory
from typing import Dict, Any, List
import networkx as nx
from .nodes.file_processor import FileProcessorNode, ImageProcessorNode, PDFProcessorNode, DataFileProcessorNode

logger = logging.getLogger(__name__)

class WorkflowExecutor:
    """工作流执行器"""
    
    def __init__(self, nodes, edges, nodes_map, edges_map, adjacency, output_dir):
        self.nodes = nodes
        self.edges = edges
        self.nodes_map = nodes_map
        self.edges_map = edges_map
        self.adjacency = adjacency
        self.node_instances = {}
        self.results = []
        self.output_dir = output_dir
        self.factory = NodeFactory(nodes, edges, nodes_map, edges_map, adjacency)
        
    def find_next_node(self, current_node_id):
        """查找当前节点的下一个节点"""
        if current_node_id not in self.adjacency:
            return None
            
        # 获取当前节点的所有出边
        out_edges = self.adjacency[current_node_id].get("out", [])
        if not out_edges:
            return None
            
        # 返回第一个连接的节点
        return out_edges[0][1] if out_edges else None
        
    def execute_node(self, node_id):
        """执行单个节点"""
        try:
            # 如果节点还未实例化，先创建实例
            if node_id not in self.node_instances:
                self.node_instances[node_id] = self.factory.create_node_instance(node_id)
            
            # 获取节点实例
            node = self.node_instances[node_id]
            
            # 设置输出目录
            if hasattr(node, 'set_output_dir'):
                node.set_output_dir(self.output_dir)
            
            # 执行节点
            logger.info(f"执行节点: {node_id}")
            result = node.run()
            
            # 记录结果
            if result:
                self.results.append({
                    'node_id': node_id,
                    'status': 'success',
                    'result': result
                })
                
            return result
            
        except Exception as e:
            logger.error(f"节点 {node_id} 执行失败: {str(e)}")
            self.results.append({
                'node_id': node_id,
                'status': 'error',
                'error': str(e)
            })
            raise
            
    def execute(self):
        """执行工作流"""
        try:
            logger.info("开始执行工作流")
            
            # 查找开始节点
            start_node = self.factory.find_start()
            if not start_node:
                raise ReactError(2, "工作流中缺少开始节点")
                
            # 查找结束节点
            end_node = self.factory.find_end()
            if not end_node:
                raise ReactError(6, "工作流中缺少结束节点")
                
            # 从开始节点开始执行
            current_node = start_node
            executed_nodes = set()
            
            while current_node is not None:
                # 检查是否已经执行过该节点（防止循环）
                if current_node in executed_nodes:
                    raise ReactError(8, f"检测到循环执行: 节点 {current_node} 已被执行过")
                    
                # 执行当前节点
                self.execute_node(current_node)
                executed_nodes.add(current_node)
                
                # 如果当前是结束节点，结束执行
                if current_node == end_node:
                    break
                    
                # 获取下一个要执行的节点
                next_node = self.find_next_node(current_node)
                if next_node is None and current_node != end_node:
                    raise ReactError(7, f"节点 {current_node} 没有连接到下一个节点")
                    
                current_node = next_node
                
            # 检查是否到达了结束节点
            if current_node != end_node:
                raise ReactError(7, "工作流未能到达结束节点")
                
            logger.info("工作流执行完成")
            return {
                "status": "success",
                "data": self.results
            }
            
        except ReactError as e:
            error_messages = {
                1: "工作流中存在多个开始节点",
                2: "工作流中缺少开始节点",
                3: f"不支持的节点类型: {e.args[0]}",
                4: f"节点 {e.args[0]} 配置错误",
                5: "工作流中存在多个结束节点",
                6: "工作流中缺少结束节点",
                7: "工作流执行未能正确到达结束节点",
                8: f"工作流执行出现循环: {e.args[0]}"
            }
            
            logger.error(f"工作流执行错误: {str(e)}")
            return {
                "status": "error",
                "message": f"错误类型 {e.type}: {error_messages.get(e.type, '未知错误')}"
            }
            
        except Exception as e:
            logger.error(f"工作流执行出现未知错误: {str(e)}")
            return {
                "status": "error",
                "message": f"未知错误: {str(e)}"
            }

    def validate(self) -> List[str]:
        """验证工作流配置"""
        errors = []
        
        # 检查是否有孤立节点
        if not nx.is_weakly_connected(self.graph) and len(self.graph.nodes) > 0:
            errors.append("工作流中存在孤立节点")
            
        # 检查是否有循环依赖
        if not nx.is_directed_acyclic_graph(self.graph):
            errors.append("工作流中存在循环依赖")
            
        # 检查节点配置
        for node_id, node in self.nodes.items():
            if not hasattr(node, "config") or not node.config:
                errors.append(f"节点 {node_id} 缺少配置信息")
                
        return errors
        