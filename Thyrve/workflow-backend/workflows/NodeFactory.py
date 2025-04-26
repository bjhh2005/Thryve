import logging
from .nodes.start_node import StartNode
from .ReactExection import ReactError
from .nodes.print_node import PrintNode
from .nodes.loop_node import LoopNode

logger = logging.getLogger(__name__)

class NodeFactory:
    nodes = None
    edges = None
    nodes_map = None
    edges_map = None
    adjacency = None


    def __init__(self, nodes, edges, nodes_map, edges_map, adjacency):
        self.nodes = nodes
        self.edges = edges
        self.nodes_map = nodes_map
        self.edges_map = edges_map
        self.adjacency = adjacency

    def find_start(self):
        start_node = None
        tmp_cnt = 0
        # 遍历每一个节点 找出是否有多个start节点或者不存在节点
        for node in self.nodes:
            if node['type'] == 'start':
                start_node = node['id']
                tmp_cnt += 1
                if tmp_cnt != 1:
                    raise ReactError(1, "Multiple start nodes found in workflow")
        if tmp_cnt == 0:
            raise ReactError(2, "There is no start node in the workflow")
        return start_node
    
    def create_node_instance(self, node_id):
        try:
            node = self.nodes_map[node_id]
            print("Create_node_instance :",node_id)
            return self.__create_node(node['type'], node_id, self.adjacency[node_id],self.nodes_map[node_id])
            
        except ReactError as e:
            logger.error(f"Error creating node instance: {str(e)}")
            raise e

    def __create_node(self, type, node_id, node_next_data, data):
        """
        根据节点类型创建节点。

        :param node_type: 字符串，表示节点的类型。
        :raises ReactError: 如果节点类型未知，则抛出异常。
        :return: 创建的节点对象。

        创建节点的过程根据传入的 `node_type` 参数来判断。
        """
        match type:
            case "start":
                return StartNode(node_id, node_next_data, data)
            case "print":
                return PrintNode(node_id, node_next_data, data)
            case "loop":
                return LoopNode(node_id, node_next_data, data)
            case _:
                raise ReactError(3, f"Unknown node type: {type}")
            
            
            