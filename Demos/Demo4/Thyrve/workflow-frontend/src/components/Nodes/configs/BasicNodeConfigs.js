export const BasicNodeConfigs = {
    start: {
        type: 'start',
        label: 'Start',
        category: '基本块',
        configs: [],
    },
    print: {
        type: 'print',
        label: 'Print',
        category: '基本块',
        configs: [
            { key: 'text', label: '输出文本', type: 'input' },
        ],
    },
    operation: {
        type: 'operation',
        label: '运算块',
        category: '基本块',
        configs: [
            {
                key: 'operator', label: '运算符', type: 'select',
                options: [
                    { value: '加', label: '加法' },
                    { value: '减', label: '减法' },
                    { value: '乘', label: '乘法' },
                    { value: '除', label: '除法' },
                    { value: '取模', label: '取模' },
                ]
            },
            { key: 'leftOperand', label: '左操作数', type: 'input' },
            { key: 'rightOperand', label: '右操作数', type: 'input' },
        ]
    },
};
