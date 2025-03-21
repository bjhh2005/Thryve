import logging
from .nodes.excel_node import ExcelNode
from .nodes.word_node import WordNode

logger = logging.getLogger(__name__)

class WorkflowExecutor:
    def __init__(self, workflow_data):
        self.nodes = workflow_data.get('nodes', [])
        self.edges = workflow_data.get('edges', [])
        self.node_instances = {}
        self.results = {}
        logger.info(f"Initialized with {len(self.nodes)} nodes and {len(self.edges)} edges")

    def create_node_instance(self, node_data):
        try:
            logger.info(f"Creating node instance for: {node_data}")
            node_type = node_data['type']
            node_id = node_data['id']
            
            if node_type == 'excel':
                return ExcelNode(node_data['data'])
            elif node_type == 'word':
                return WordNode(node_data['data'])
            else:
                raise ValueError(f"Unknown node type: {node_type}")
        except Exception as e:
            logger.error(f"Error creating node instance: {str(e)}")
            raise

    def get_node_dependencies(self, node_id):
        return [edge['source'] for edge in self.edges if edge['target'] == node_id]

    def execute_node(self, node_id):
        logger.info(f"Executing node: {node_id}")
    
        if node_id in self.results:
            logger.info(f"Returning cached result for node {node_id}")
            return self.results[node_id]

        # 获取并执行所有依赖节点
        dependencies = self.get_node_dependencies(node_id)
        input_data = {}
        for dep_id in dependencies:
            logger.info(f"Executing dependency {dep_id} for node {node_id}")
            input_data[dep_id] = self.execute_node(dep_id)

        # 执行当前节点
        logger.info(f"Executing node {node_id} with input data: {input_data}")
        node_instance = self.node_instances[node_id]
        result = node_instance.execute(input_data)
        self.results[node_id] = result
        logger.info(f"Node {node_id} execution completed with result: {result}")
    
        return result

    def execute(self):
        try:
            logger.info("Starting workflow execution")
        
            # 创建所有节点实例
            for node in self.nodes:
                node_id = node['id']
                self.node_instances[node_id] = self.create_node_instance(node)
                logger.info(f"Created instance for node {node_id}")

            # 找到终端节点（没有输出连接的节点）
            end_nodes = []
            source_nodes = set(edge['source'] for edge in self.edges)
            target_nodes = set(edge['target'] for edge in self.edges)
        
            for node in self.nodes:
                if node['id'] not in source_nodes:  # 如果节点不是任何边的源节点
                    end_nodes.append(node['id'])
            
            logger.info(f"End nodes to execute: {end_nodes}")

            # 从每个终端节点开始反向执行
            results = {}
            for node_id in end_nodes:
                results[node_id] = self.execute_node(node_id)

            logger.info(f"Workflow execution completed with results: {results}")
            return results

        except Exception as e:
            logger.error(f"Error in workflow execution: {str(e)}")
            raise