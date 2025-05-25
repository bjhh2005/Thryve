from .base_node import BaseNode
import pandas as pd
import numpy as np
import json

class ExcelNode(BaseNode):
    def __init__(self, id: str, next_data: dict, node_data: dict):
        super().__init__(id, "excel", next_data, node_data)
        self.config = node_data.get('data', {})
        
        if len(self._next_data["out"]) > 0:
            self._next_node = self._next_data["out"][0][1]
            self._out_handle = self._next_data["out"][0][2]
        
        if len(self._next_data["in"]) > 0:
            self._in_handle = self._next_data["in"][0][2]

    def run(self):
        try:
            operation = self.config.get('operation', 'read')
            filename = self.config.get('filename')

            if not filename:
                raise ValueError("需要指定Excel文件路径")

            if operation == 'read':
                return self._read_excel(filename)
            elif operation == 'write':
                return self._write_excel(filename)
            elif operation == 'sum':
                return self._sum_excel(filename)
            else:
                raise ValueError(f"不支持的操作: {operation}")

        except Exception as e:
            raise ValueError(str(e))

    def _read_excel(self, filename: str) -> str:
        df = pd.read_excel(filename)
        self.output_data = df.to_dict('records')
        return "Excel读取完成"

    def _write_excel(self, filename: str) -> str:
        if not self.input_data:
            raise ValueError("没有要写入的数据")
            
        if isinstance(self.input_data, (list, dict)):
            df = pd.DataFrame(self.input_data)
        else:
            df = pd.DataFrame([{"data": self.input_data}])
            
        df.to_excel(filename, index=False)
        self.output_data = "写入成功"
        return f"Excel写入完成：{filename}"

    def _sum_excel(self, filename: str) -> str:
        df = pd.read_excel(filename)
        numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
        sums = {col: int(df[col].sum()) for col in numeric_cols}
        self.output_data = sums
        return f"Excel求和完成：{sums}"