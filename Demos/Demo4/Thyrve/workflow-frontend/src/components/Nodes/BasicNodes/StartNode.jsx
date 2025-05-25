import React from 'react';
import { Card } from 'antd';
import { Handle } from 'reactflow';

const StartNode = () => {
    return (
        <Card
            title="Start"
            className='node basic-node'
        >
            <Handle type="source" position="right" />
            <p>启动流程</p>
        </Card>
    );
};

export default StartNode;
