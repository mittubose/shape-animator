import React, { useState, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

const StateMachineEditor = ({ states, transitions, setActiveState }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const initialNodes = states.map((state, i) => ({
      id: state.id,
      data: { label: state.name },
      position: { x: i * 150, y: 100 },
    }));

    const initialEdges = transitions.map(t => ({
      id: `e${t.from}-${t.to}`,
      source: t.from,
      target: t.to,
      label: t.trigger,
    }));

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [states, transitions, setNodes, setEdges]);

  const onNodesDelete = (nodesToRemove) => {
    // Logic to remove states/transitions
  };

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const onNodeClick = (event, node) => {
    setActiveState(node.id);
  };

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default StateMachineEditor;
