from flask import Flask, request, jsonify
from flask_cors import CORS
from workflows.executor import WorkflowExecutor
import logging

app = Flask(__name__)
CORS(app)

# 设置详细的日志记录
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/api/workflow/execute', methods=['POST'])
def execute_workflow():
    try:
        logger.info("Received workflow execution request")
        workflow_data = request.json
        logger.info(f"Workflow data: {workflow_data}")
        
        executor = WorkflowExecutor(workflow_data)
        result = executor.execute()
        
        # logger.info(f"Execution result: {result}")

        if result["status"] == "error":
            return jsonify({"status": "error", "message": result["message"]})
        elif result["status"] == "success":
            return jsonify({"status": "success", "data": result["data"]})
        
    except Exception as e:
        logger.error(f"Error executing workflow: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)