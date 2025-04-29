import React from 'react';
import { Input, Card } from "antd";
import { Handle, useReactFlow } from 'reactflow';

const BranchNode = ({ id, data }) => {
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
            title="分支判断"
            className="node control-node branch"
        >
            <Handle type="target" position="left" />

            <div className='control'>
                <label>条件：</label>
                <Input
                    className='funcInput'
                    value={data.condition}
                    onChange={(e) => updateNodeData('condition', e.target.value)}
                    placeholder="如 x > 5"
                />
            </div>

            <div className='handle-labels'>
                <span style={{ position: 'absolute', right: '75%', fontSize: '12px' }}>真</span>
                <span style={{ position: 'absolute', right: '25%', fontSize: '12px' }}>假</span>
            </div>

            <Handle type="source" position="right" id="true" style={{ top: '100%', right: '80%' }} />
            <Handle type="source" position="right" id="false" style={{ top: '100%', right: '20%' }} />
        </Card>
    );
};

export default BranchNode;
