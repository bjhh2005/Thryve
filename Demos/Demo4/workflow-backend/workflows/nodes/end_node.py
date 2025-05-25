from .node import Node

class EndNode(Node):
    def __init__(self, id, next_data, node_data):
        super(EndNode, self).__init__(id, "end", next_data, node_data)
        self._next_node = None
        self._out_handle = None
        self._in_handle = self._next_data["in"][0][2] if len(self._next_data["in"]) > 0 else None

    def run(self):
        return "工作流执行完成！" 