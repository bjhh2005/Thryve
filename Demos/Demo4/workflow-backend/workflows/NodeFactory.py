import logging
from .nodes.start_node import StartNode
from .nodes.print_node import PrintNode
from .nodes.loop_node import LoopNode
from .nodes.excel_node import ExcelNode
from .nodes.word_node import WordNode
from .nodes.end_node import EndNode
from .nodes.file_processor import ImageProcessorNode, PDFProcessorNode, DataFileProcessorNode, TextProcessorNode
from .ReactExection import ReactError

logger = logging.getLogger(__name__)

class NodeFactory:
    def __init__(self, nodes, edges, nodes_map, edges_map, adjacency):
        self.nodes = nodes
        self.edges = edges
        self.nodes_map = nodes_map
        self.edges_map = edges_map
        self.adjacency = adjacency

    def find_start(self):
        start_node = None
        tmp_cnt = 0
        for node in self.nodes:
            if node['type'] == 'start':
                start_node = node['id']
                tmp_cnt += 1
                if tmp_cnt != 1:
                    raise ReactError(1, "工作流中存在多个开始节点")
        if tmp_cnt == 0:
            raise ReactError(2, "工作流中缺少开始节点")
        return start_node
    
    def find_end(self):
        end_node = None
        tmp_cnt = 0
        for node in self.nodes:
            if node['type'] == 'end':
                end_node = node['id']
                tmp_cnt += 1
                if tmp_cnt != 1:
                    raise ReactError(5, "工作流中存在多个结束节点")
        if tmp_cnt == 0:
            raise ReactError(6, "工作流中缺少结束节点")
        return end_node
    
    def create_node_instance(self, node_id):
        try:
            node = self.nodes_map[node_id]
            logger.info(f"创建节点实例: {node_id}, 类型: {node['type']}")
            return self.__create_node(node['type'], node_id, self.adjacency[node_id], self.nodes_map[node_id])
            
        except ReactError as e:
            logger.error(f"创建节点实例失败: {str(e)}")
            raise e

    def __create_node(self, type, node_id, node_next_data, data):
        match type:
            case "start":
                return StartNode(node_id, node_next_data, data)
            case "end":
                return EndNode(node_id, node_next_data, data)
            case "print":
                return PrintNode(node_id, node_next_data, data)
            case "loop":
                return LoopNode(node_id, node_next_data, data)
            case "excel":
                return ExcelNode(node_id, node_next_data, data)
            case "word":
                return WordNode(node_id, node_next_data, data)
            case "image":
                return ImageProcessorNode(node_id, node_next_data, data)
            case "pdf":
                return PDFProcessorNode(node_id, node_next_data, data)
            case "data":
                return DataFileProcessorNode(node_id, node_next_data, data)
            case "text":
                return TextProcessorNode(node_id, node_next_data, data)
            case _:
                raise ReactError(3, f"不支持的节点类型: {type}")
            
            
            