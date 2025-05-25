from abc import ABC, abstractmethod
from typing import Any, Dict
import os
import logging

logger = logging.getLogger(__name__)

class BaseNode(ABC):
    def __init__(self, id: str, type: str, next_data: Dict, node_data: Dict):
        self._id = id
        self._type = type
        self._next_data = next_data
        self._node_data = node_data
        self._next_node = None
        self._in_handle = None
        self._out_handle = None
        self._is_back = False
        self.input_data = None
        self.output_data = None
        self.output_dir = None

    def set_output_dir(self, output_dir: str) -> None:
        """设置输出目录"""
        self.output_dir = output_dir
        # 确保输出目录存在
        os.makedirs(output_dir, exist_ok=True)

    def get_output_path(self, filename: str) -> str:
        """获取输出文件路径"""
        if not self.output_dir:
            raise ValueError("输出目录未设置")
        return os.path.join(self.output_dir, filename)

    @abstractmethod
    def run(self) -> Any:
        """执行节点操作"""
        pass

    def set_input(self, data: Any) -> None:
        """设置输入数据"""
        self.input_data = data

    def get_output(self) -> Any:
        """获取输出数据"""
        return self.output_data

    def get_next(self):
        return self._next_node

    def get_in_handle(self):
        return self._in_handle

    def get_out_handle(self):
        return self._out_handle

    def get_back(self):
        return self._id if self._is_back else None 