import React from 'react';
import { Input, Card } from 'antd';
import { Handle, useReactFlow } from 'reactflow';

const LoopNode = ({ id, data }) => {
    const { setNodes } = useReactFlow();

    const updateNodeData = (key, value) => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, [key]: value } } : node
            )
        );
    };

    return (
        <Card title="循环块" className="node control-node">
            <Handle type="target" position="left" />

            <div className="loop">
                <label>循环次数：</label>
                <Input
                    className="funcInput"
                    type="number"
                    min={1}
                    value={data.count}
                    onChange={(e) => updateNodeData('count', e.target.value)}
                    placeholder="输入循环次数"
                />
            </div>

            <Handle type="source" position="right" />
        </Card>
    );
};

export default LoopNode;
