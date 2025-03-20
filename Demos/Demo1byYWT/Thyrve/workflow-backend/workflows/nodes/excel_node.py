import pandas as pd
import numpy as np
import json

class ExcelNode:
    def __init__(self, config):
        self.config = config

    def execute(self, input_data=None):
        try:
            operation = self.config.get('operation', 'read')
            filename = self.config.get('filename')

            if not filename:
                raise ValueError("Filename is required")

            if operation == 'read':
                return self.read_excel(filename)
            elif operation == 'sum':
                return self.sum_excel(filename)
            else:
                raise ValueError(f"Unsupported operation: {operation}")

        except Exception as e:
            return {"status": "error", "message": str(e)}

    def read_excel(self, filename):
        df = pd.read_excel(filename)
        # 将数据转换为普通Python类型
        return {
            "status": "success",
            "data": df.to_dict('records')
        }

    def sum_excel(self, filename):
        df = pd.read_excel(filename)
        numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
        # 将int64转换为普通Python整数
        sums = {col: int(df[col].sum()) for col in numeric_cols}
        return {
            "status": "success",
            "data": sums
        }