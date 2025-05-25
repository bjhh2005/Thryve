from .node import Node

class PrintNode(Node):
    def __init__(self, id, next_data, node_data):
        super(PrintNode, self).__init__(id, "print", next_data, node_data)
        if len(self._next_data["out"]) == 0:
            self._next_node = None
        else:
            self._next_node = self._next_data["out"][0][1]

    def run(self):
        print(self._node_data)
        return self._node_data["data"]["content"]