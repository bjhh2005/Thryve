from abc import ABC, abstractmethod
from typing import final

class Node(ABC):
    def __init__(self, id, type, next_data, node_data):
        """
        初始化节点的基本属性。

        :param _id: 每个节点的唯一标识符，用于区分不同的节点。
        :param _type: 节点的类型，决定节点的行为和特性。
        :param _next_data: 邻接节点的数据，通常用于图或链表结构。
        :param _node_data: 节点的运行数据，保存节点的状态信息或计算结果。
        """
        self._id = id
        self._type = type
        self._next_data = next_data
        self._node_data = node_data
        self._next_node = None

    @abstractmethod
    def run(self):
        """
        执行节点的操作。

        这是一个抽象方法，具体的节点操作将在子类中定义。
        每个节点的运行逻辑应该在这个方法中实现。
        """
        pass
    
    @final
    def get_next(self):
        return self._next_node
    