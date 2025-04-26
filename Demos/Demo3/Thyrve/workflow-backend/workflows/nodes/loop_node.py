from .node import Node
from ..ReactExection import ReactError


class LoopNode(Node):
    
    def __init__(self, id, next_data, node_data):
        super(LoopNode, self).__init__(id, "loop", next_data, node_data)
        
        # 设置循环次数 如果无效 抛出异常
        if self._node_data['data'].get("Loopcnt") and self._node_data['data']['Loopcnt'].isdigit():
            self._node_data['data']['Loopcnt'] = int(self._node_data['data']['Loopcnt'])
        else:
            raise ReactError(4, f"{self._id}")
        

        self._in_handle = self._next_data["in"][0][2]
        handles = [item[2] for item in self._next_data['out']]
        next_handles = ["workflow_output", "workflow_output_loopbody"]
        
        self.loop_id = None
        self.over_id = None

        # 找下一个节点的位置
        if next_handles[0] in handles:
            index = handles.index(next_handles[0])
            self.over_id = self._next_data["out"][index][1]
        
        if next_handles[1] in handles:
            index = handles.index(next_handles[1])
            self.loop_id = self._next_data["out"][index][1]

    def run(self):

        if self._node_data['data']['Loopcnt'] == 0:
            self._is_back = False
            self._next_node = self.over_id
            self._out_handle = "workflow_output"
        else:
            self._is_back = True
            self._node_data['data']['Loopcnt'] -= 1
            self._next_node = self.loop_id
            self._out_handle = "workflow_output_loopbody"
        
        return None