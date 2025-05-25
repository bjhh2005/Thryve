export const ControlNodeConfigs = {
    branch: {
        type: 'branch',
        label: '分支块',
        category: '控制块',
        configs: [
            { key: 'condition1', label: '条件表达式', type: 'input' }
        ]
    },
    loop: {
        type: 'loop',
        label: '循环块',
        category: '控制块',
        configs: [
            { key: 'condition2', label: '循环条件', type: 'input' }
        ]
    },
}