from .node import Node

class StartNode(Node):
    def __init__(self, id, next_data, node_data):
        super(StartNode, self).__init__(id, "start", next_data, node_data)
        if len(self._next_data["out"]) == 0:
            self._next_node = None
            self._out_handle = None
        else:
            self._next_node = self._next_data["out"][0][1]
            self._out_handle = self._next_data["out"][0][2]
            
        self._in_handle = None

    def run(self):
        return "Begin!"
        