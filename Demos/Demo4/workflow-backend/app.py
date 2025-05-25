from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from workflows.executor import WorkflowExecutor

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# 文件目录配置
OUTPUT_FOLDER = 'outputs'

# 确保输出目录存在
if not os.path.exists(OUTPUT_FOLDER):
    os.makedirs(OUTPUT_FOLDER)
    logger.info(f"创建目录: {OUTPUT_FOLDER}")

app.config.update(
    OUTPUT_FOLDER=OUTPUT_FOLDER,
)

@app.route('/api/workflow/execute', methods=['POST'])
def execute_workflow():
    data = request.json
    if not data:
        return jsonify({'error': '没有工作流数据'}), 400
        
    try:
        # 创建执行器实例，传入完整的工作流数据
        executor = WorkflowExecutor(
            nodes=data.get('nodes', []),
            edges=data.get('edges', []),
            nodes_map={node['id']: node for node in data.get('nodes', [])},
            edges_map={edge['id']: edge for edge in data.get('edges', [])},
            adjacency=build_adjacency(data.get('nodes', []), data.get('edges', [])),
            output_dir=app.config['OUTPUT_FOLDER']
        )
            
        # 执行工作流
        results = executor.execute()
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"工作流执行错误: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

def build_adjacency(nodes, edges):
    """构建节点的邻接关系"""
    adjacency = {}
    
    # 初始化所有节点的邻接信息
    for node in nodes:
        adjacency[node['id']] = {
            'in': [],   # [(source_id, target_id, handle)]
            'out': []   # [(source_id, target_id, handle)]
        }
    
    # 添加边的信息
    for edge in edges:
        source_id = edge['source']
        target_id = edge['target']
        source_handle = edge.get('sourceHandle', 'default')
        target_handle = edge.get('targetHandle', 'default')
        
        # 添加出边信息
        if source_id in adjacency:
            adjacency[source_id]['out'].append((source_id, target_id, source_handle))
            
        # 添加入边信息
        if target_id in adjacency:
            adjacency[target_id]['in'].append((source_id, target_id, target_handle))
            
    return adjacency

if __name__ == '__main__':
    app.run(debug=True)