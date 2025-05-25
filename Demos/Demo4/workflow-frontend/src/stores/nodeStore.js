import create from 'zustand';

export const useNodeStore = create((set) => ({
  selectedNodeId: null,
  nodeConfigs: {},
  
  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),
  
  updateNodeConfig: (nodeId, config) => set((state) => ({
    nodeConfigs: {
      ...state.nodeConfigs,
      [nodeId]: config
    }
  })),
  
  getNodeConfig: (nodeId) => {
    const state = useNodeStore.getState();
    return state.nodeConfigs[nodeId] || {};
  },
  
  clearNodeConfig: (nodeId) => set((state) => {
    const { [nodeId]: _, ...rest } = state.nodeConfigs;
    return { nodeConfigs: rest };
  }),
  
  clearAllConfigs: () => set({ nodeConfigs: {} })
})); 