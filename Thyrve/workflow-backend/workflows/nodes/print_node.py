from .node import Node
from ..ReactExection import ReactError
class PrintNode(Node):
    def __init__(self, id, next_data, node_data):
        super(PrintNode, self).__init__(id, "print", next_data, node_data)
        
        if len(self._next_data["out"]) == 0:
            self._next_node = None
            self._out_handle = None
        else:
            self._next_node = self._next_data["out"][0][1]
            self._out_handle = self._next_data["out"][0][2]

        self._in_handle = self._next_data["in"][0][2]

    def run(self):
        print(self._node_data)
        if self._node_data["data"].get("content"):
            return self._node_data["data"]["content"]
        else:
            raise ReactError(4, f"{self._id}")