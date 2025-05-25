import React from 'react';
import { Input, Card } from "antd";
import { Handle, useReactFlow } from 'reactflow';

const OperationNode = ({ id, data }) => {
    const { setNodes } = useReactFlow();

    const updateNodeData = (key, value) => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, [key]: value } } : node
            )
        );
    };

    return (
        <Card
            title="运算块"
            className="node basic-node operation-node"
        >
            <Handle type="target" position="left" />

            <div className='input'>
                <label>左操作数:</label>
                <Input
                    className='funcInput'
                    value={data.operandA}
                    onChange={(e) => updateNodeData('operandA', e.target.value)}
                    placeholder="输入第一个数"
                />
            </div>

            <div className='operator'>
                <label>运算符：</label>
                <select
                    value={data.operator}
                    onChange={(e) => updateNodeData('operator', e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <option value="add">加</option>
                    <option value="sub">减</option>
                    <option value="mul">乘</option>
                    <option value="div">除</option>
                    <option value="mod">取模</option>
                </select>
            </div>

            <div className='input'>
                <label>右操作数:</label>
                <Input
                    className='funcInput'
                    value={data.operandB}
                    onChange={(e) => updateNodeData('operandB', e.target.value)}
                    placeholder="输入第二个数"
                />
            </div>

            <Handle type="source" position="right" />
        </Card>
    );
};

export default OperationNode;
