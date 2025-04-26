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
        :param _in_handle: 表示节点上一次是从哪里进入的
        :param _out_handle: 表示节点上一次是从哪里离开的
        :param _is_back: 表示节点是否需要进入栈 对于循环节点 变量节点, 会出现需要反复运行的情况, 那么这里就将其入栈
        """
        
        # 静态数据
        self._id = id
        self._type = type
        self._next_data = next_data
        self._node_data = node_data

        # 动态数据
        self._next_node = None
        self._in_handle = None
        self._out_handle = None
        self._is_back = False

    @abstractmethod
    def run(self):
        """
        执行节点的操作。

        这是一个抽象方法，具体的节点操作将在子类中定义。
        每个节点的运行逻辑应该在这个方法中实现。

        节点运行的时候,需要有以下的考虑:
        result是什么
        更新next_data
        更新自己的数据
        更新自己的_in_handle _out_handle
        """
        pass
    


    @final
    def get_next(self):
        '''
        :return 返回节点的下一个执行的节点 如果没有下一个 那么设为None
        '''
        return self._next_node
    
    @final
    def get_in_handle(self):
        '''
        :return 返回节点的上一次是从哪里进入的 如果没有上一个进入的节点(start) 那么设为None
        '''
        return self._in_handle
    
    @final
    def get_out_handle(self):
        '''
        :return 返回节点的上一次是从哪里离开的 如果没有上一个离开的节点 那么设为None
        '''
        return self._out_handle

    @final
    def get_back(self):
        '''
        :return 返回节点是否需要循环
        '''
        if self._is_back:
            return self._id
        else:
            return None
    
    @final
    def set_in_handl(self, in_handle):
        self._in_handle = in_handle