import logging
from .nodes.excel_node import ExcelNode
from .nodes.word_node import WordNode
from .ReactExection import ReactError
from .NodeFactory import NodeFactory
logger = logging.getLogger(__name__)

class WorkflowExecutor:

    def __init__(self, workflow_data):

        
        # 第一 在这里设置两个原始的数据处理并且清洗
        # 这里有两个数据结构
        # 第一 节点列表 结构如下：
        # self.nodes = [
        #     { ...node data... },
        #     { ...node data... },
        #     ...
        # ]
        # 第二 边列表 结构如下：
        # self.edges = [
        #     { "source": "start-xxxx", "target": "print-xxxx" },
        #     { "source": "print-xxxx", "target": "end-xxxx" },
        #     ...
        # ]
        
        nodes = workflow_data.get('nodes', [])
        edges = workflow_data.get('edges', [])
        

        # 这里想要对node进行清洗，去掉不需要的数据
        keys_to_remove = {
            'position',
            'width',
            'height',
            'selected',
            'positionAbsolute',
            'dragging'
        }

        # 清理每个节点
        for node in nodes:
            for key in keys_to_remove:
                node.pop(key, None)  # 用 pop(key, None) 安全地删除不存在的字段
        
        
        print("----------------------------------------------------")
        print("Node Set")
        for node in nodes:
            print(node)
        print("----------------------------------------------------")


        print("----------------------------------------------------")
        print("Edges Set")
        for edge in edges:
            print(edge)
        print("----------------------------------------------------")



        # 这里设置了两个id到结构的映射
        # 第一 id到node的映射 结构如下：
        # self.node_map = {
        #     "start-xxxx": { ...node data... },
        #     "print-xxxx": { ...node data... },
        #     ...
        # }
        # 第二 id到edge的映射 结构如下：
        # self.edge_map = {
        #     "edge-xxxx": { ...edge data... },
        #     "edge-yyyy": { ...edge data... },
        #     ...
        # }

        node_map = {node['id']: node for node in nodes}
        
        edge_map = {edge['id']: edge for edge in edges}


        print("----------------------------------------------------")
        print("Id to Nodes : ")
        for node_id, node in node_map.items():
            print(node_id, "  :  ", node)
        print("----------------------------------------------------")
        print("----------------------------------------------------")
        print("Id to Edges : ")
        for edge_id, edge in edge_map.items():
            print(edge_id, "  :  ", edge)
        print("----------------------------------------------------")



        # 第三 这里构建邻接表 结构如下：
        # self.adjacency = {
        #     "node-xxxx": { "in": [("edge-yyyy", "node-yyyy", "handle-xxx"), ("edge-zzzz", "node-zzzz", "handle-xxx")], "out": [] },
        #     "node-yyyy": { "in": [], "out": [("edge-yyyy", "node-xxxx", "handle-xxx")] },
        #     ...
        # }
        # 其中第一项是边的id 第二项是对应的节点的id 第三个是对应的handle的id


        adjacency = {}

        # 初始化邻接表
        for node in nodes:
            adjacency[node['id']] = {'in': [], 'out': []}

        # 构建邻接关系（用 edge.id 关联）
        for edge in edges:
            source_id = edge['source']
            target_id = edge['target']
            edge_id = edge['id']
            source_handle = edge['sourceHandle']
            target_handle = edge['targetHandle']

            if source_id in adjacency:
                adjacency[source_id]['out'].append((edge_id, target_id, source_handle))

            # "in" relationship: the node that is the target of this edge
            if target_id in adjacency:
                adjacency[target_id]['in'].append((edge_id, source_id, target_handle))


        print("----------------------------------------------------")
        print("Node to Edges and Node")
        for node_id, adj in adjacency.items():
            print(node_id, "  :  ", adj)
        print("----------------------------------------------------")


        self.node_instances = {}
        self.results = []
        self.factory = NodeFactory(nodes, edges, node_map, edge_map, adjacency)
        

    def execute_node(self, node_id):
        cur_node = self.node_instances[node_id]
        result = cur_node.run()
        next = cur_node.get_next()
        out_handle = cur_node.get_out_handle()
        back_node = cur_node.get_back()
        return result,next,out_handle,back_node

    def execute(self):
        try:
            logger.info("Starting workflow execution")
            
            
            # 开始按照顺序执行节点
            cur_node = self.factory.find_start()
            next_node = "__WHU__"
            out_handle = "__WHU__"

            back_stack = []

            while next_node is not None:
                # 判断当前节点是否被实例化
                
                if cur_node not in self.node_instances:
                    self.node_instances[cur_node] = self.factory.create_node_instance(cur_node)
                
                result,next_node,out_handle,back_node = self.execute_node(cur_node)
                
                if result:
                    self.results.append({cur_node:result})

                if back_node:
                    back_stack.append(back_node)
                
                if not next_node and len(back_stack):
                    next_node = back_stack.pop()

                cur_node = next_node
                    

            return {"status": "success", "data" : self.results}
  
        except ReactError as e:

            if e.type == 1:
                logger.error(f"Error: {str(e)}")
                return {"status": "error", "message": "error type 1: There are multiple start nodes in the workflow"}
            elif e.type == 2:
                logger.error(f"Error: {str(e)}")
                return {"status": "error", "message": "error type 2: There is no start node in the workflow"}
            elif e.type == 3:
                logger.error(f"Error: {str(e)}")
                return {"status": "error", "message": f"error type 3: Unknown node type: {e.args[0]}"}
            elif e.type == 4:
                logger.error(f"Error: {str(e)}")
                return {"status": "error", "message": f"error type 4: {e.args[0]} content error"}
            