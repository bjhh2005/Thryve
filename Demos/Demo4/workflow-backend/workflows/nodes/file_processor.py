from .base_node import BaseNode
import os
from typing import Dict, Any, List
import cv2
import numpy as np
from PIL import Image
import fitz  # PyMuPDF
import pandas as pd
import logging
import shutil
from pathlib import Path

logger = logging.getLogger(__name__)

class FileProcessorNode(BaseNode):
    """文件处理节点的基类"""
    
    def __init__(self, id: str, type: str, next_data: Dict, node_data: Dict):
        super().__init__(id, type, next_data, node_data)
        self.config = node_data.get('data', {})
        
        if len(self._next_data["out"]) > 0:
            self._next_node = self._next_data["out"][0][1]
            self._out_handle = self._next_data["out"][0][2]
        
        if len(self._next_data["in"]) > 0:
            self._in_handle = self._next_data["in"][0][2]

    def get_input_file(self) -> str:
        """获取输入文件路径"""
        filepath = self.config.get('filename')
        if not filepath:
            raise ValueError("未指定输入文件路径")
            
        # 确保文件存在
        if not os.path.exists(filepath):
            raise ValueError(f"文件不存在: {filepath}")
            
        return filepath
        
    def prepare_output_file(self, input_path: str, suffix: str = None) -> str:
        """准备输出文件路径"""
        if not self.output_dir:
            raise ValueError("输出目录未设置")
            
        # 获取原始文件名
        original_name = Path(input_path).name
        
        # 如果指定了新的后缀，替换原文件后缀
        if suffix:
            original_name = Path(original_name).stem + suffix
            
        # 构建输出文件路径
        output_path = os.path.join(self.output_dir, f"{self._id}_{original_name}")
        
        # 确保输出目录存在
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        return output_path
        
    def copy_to_output(self, input_path: str, suffix: str = None) -> str:
        """复制文件到输出目录"""
        output_path = self.prepare_output_file(input_path, suffix)
        shutil.copy2(input_path, output_path)
        return output_path

class ImageProcessorNode(FileProcessorNode):
    """图像处理节点"""
    
    def __init__(self, id: str, next_data: Dict, node_data: Dict):
        super().__init__(id, "image", next_data, node_data)
        self._type = "image"
    
    def run(self) -> Any:
        operation = self.config.get("operation", "")
        filename = self.config.get("filename")
        
        if not os.path.exists(filename):
            raise ValueError(f"文件不存在: {filename}")
            
        if operation == "channel_split":
            return self._split_channels(filename)
        elif operation == "crop":
            return self._crop_image(filename)
        else:
            raise ValueError(f"不支持的操作: {operation}")
            
    def _split_channels(self, filename: str) -> Dict[str, str]:
        img = cv2.imread(filename)
        b, g, r = cv2.split(img)
        # 构建输出文件路径
        base_dir = os.path.dirname(filename)
        blue_path = os.path.join(base_dir, f"{self._id}_blue.png")
        green_path = os.path.join(base_dir, f"{self._id}_green.png")
        red_path = os.path.join(base_dir, f"{self._id}_red.png")
        # 保存图片
        cv2.imwrite(blue_path, b)
        cv2.imwrite(green_path, g)
        cv2.imwrite(red_path, r)
        self.output_data = {
            "blue": blue_path,
            "green": green_path,
            "red": red_path
        }
        return "图像色道分离完成，已保存为图片"
        
    def _crop_image(self, filename: str) -> str:
        img = cv2.imread(filename)
        left_top_x = self.config.get("left_top_x")
        left_top_y = self.config.get("left_top_y")
        right_bottom_x = self.config.get("right_bottom_x")
        right_bottom_y = self.config.get("right_bottom_y")
        if left_top_x is None or left_top_y is None or right_bottom_x is None or right_bottom_y is None:
            raise ValueError("请分别提供左上(left_top_x, left_top_y)和右下(right_bottom_x, right_bottom_y)的坐标值")
        x1, y1 = float(left_top_x), float(left_top_y)
        x2, y2 = float(right_bottom_x), float(right_bottom_y)
        # 自动推算四个角点
        pts1 = np.float32([
            [x1, y1],      # 左上
            [x2, y1],      # 右上
            [x2, y2],      # 右下
            [x1, y2]       # 左下
        ])
        width = int(abs(x2 - x1))
        height = int(abs(y2 - y1))
        pts2 = np.float32([
            [0, 0],
            [width - 1, 0],
            [width - 1, height - 1],
            [0, height - 1]
        ])
        # 计算变换矩阵并裁剪
        M = cv2.getPerspectiveTransform(pts1, pts2)
        dst = cv2.warpPerspective(img, M, (width, height))
        # 保存或返回
        base_dir = os.path.dirname(filename)
        crop_path = os.path.join(base_dir, f"{self._id}_crop.png")
        cv2.imwrite(crop_path, dst)
        self.output_data = crop_path
        return "图像裁剪完成"

class PDFProcessorNode(FileProcessorNode):
    """PDF处理节点"""
    
    def __init__(self, id: str, next_data: Dict, node_data: Dict):
        super().__init__(id, "pdf", next_data, node_data)
        self._type = "pdf"
    
    def run(self) -> str:
        operation = self.config.get("operation", "")
        filename = self.config.get("filename")
        
        if not os.path.exists(filename):
            raise ValueError(f"文件不存在: {filename}")
            
        if operation == "split":
            return self._split_pages(filename)
        elif operation == "extract_text":
            return self._extract_text(filename)
        else:
            raise ValueError(f"不支持的操作: {operation}")
            
    def _split_pages(self, filename: str) -> str:
        pdf_doc = fitz.open(filename)
        output_dir = os.path.join(os.path.dirname(filename), "split_pages")
        os.makedirs(output_dir, exist_ok=True)
        
        output_files = []
        for page_num in range(pdf_doc.page_count):
            new_doc = fitz.open()
            new_doc.insert_pdf(pdf_doc, from_page=page_num, to_page=page_num)
            output_path = os.path.join(output_dir, f"page_{page_num+1}.pdf")
            new_doc.save(output_path)
            output_files.append(output_path)
            new_doc.close()
            
        pdf_doc.close()
        self.output_data = output_files
        return f"PDF分割完成，共{len(output_files)}页"
        
    def _extract_text(self, filename: str) -> str:
        pdf_doc = fitz.open(filename)
        text = ""
        for page in pdf_doc:
            text += page.get_text()
        pdf_doc.close()
        self.output_data = text
        return "PDF文本提取完成"

class DataFileProcessorNode(FileProcessorNode):
    """数据文件处理节点"""
    
    def __init__(self, id: str, next_data: Dict, node_data: Dict):
        super().__init__(id, "data", next_data, node_data)
        self._type = "data"
    
    def run(self) -> str:
        operation = self.config.get("operation", "")
        filename = self.config.get("filename")
        
        if not os.path.exists(filename):
            raise ValueError(f"文件不存在: {filename}")
            
        if operation == "excel_extract":
            return self._excel_extract(filename)
        elif operation == "csv_transform":
            return self._csv_transform(filename)
        else:
            raise ValueError(f"不支持的操作: {operation}")
            
    def _excel_extract(self, filename: str) -> str:
        sheet_name = self.config.get("sheet_name", 0)
        self.output_data = pd.read_excel(filename, sheet_name=sheet_name)
        return "Excel数据提取完成"
        
    def _csv_transform(self, filename: str) -> str:
        encoding = self.config.get("encoding", "utf-8")
        separator = self.config.get("separator", ",")
        self.output_data = pd.read_csv(filename, encoding=encoding, sep=separator)
        return "CSV数据转换完成"

class TextProcessorNode(FileProcessorNode):
    """文本处理节点"""
    
    def __init__(self, id: str, next_data: Dict, node_data: Dict):
        super().__init__(id, "text", next_data, node_data)
        self._type = "text"
    
    def run(self) -> str:
        operation = self.config.get("operation", "")
        filename = self.config.get("filename")
        
        if not os.path.exists(filename):
            raise ValueError(f"文件不存在: {filename}")
            
        if operation == "write":
            return self._write_text(filename)
        elif operation == "replace":
            return self._replace_text(filename)
        elif operation == "append":
            return self._append_text(filename)
        else:
            raise ValueError(f"不支持的操作: {operation}")
    
    def _write_text(self, filename: str) -> str:
        content = self.config.get("content", "")
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        self.output_data = content
        return "文本写入完成"
    
    def _replace_text(self, filename: str) -> str:
        search_text = self.config.get("searchText", "")
        replace_text = self.config.get("replaceText", "")
        
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content.replace(search_text, replace_text)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        self.output_data = new_content
        return f"文本替换完成：{search_text} -> {replace_text}"
    
    def _append_text(self, filename: str) -> str:
        content = self.config.get("content", "")
        
        with open(filename, 'a', encoding='utf-8') as f:
            f.write('\n' + content)
            
        with open(filename, 'r', encoding='utf-8') as f:
            self.output_data = f.read()
            
        return "文本追加完成" 