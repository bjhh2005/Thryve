import React from 'react';
import { Card, Input } from 'antd';
import { Handle, useReactFlow } from 'reactflow';

const PrintNode = ({ id, data }) => {
    const { setNodes } = useReactFlow(); // 用reactflow提供的方法修改节点

    const handleTextChange = (e) => {
        const newText = e.target.value;

        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            content: newText, // 更新data.text
                        },
                    };
                }
                return node;
            })
        );
    };

    return (
        <Card
            title="Print"
            className="node basic-node print"
        >
            <Handle type="target" position="left" />
            <p>打印内容：</p>
            <Input
                value={data.content || ''} // 绑定data.text
                onChange={handleTextChange} // 输入时更新data.text
                placeholder="请输入打印内容"
                size="small"
            />
            <Handle type="source" position="right" />
        </Card>
    );
};

export default PrintNode;