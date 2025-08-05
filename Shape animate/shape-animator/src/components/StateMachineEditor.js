import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDrag, useDrop } from 'react-dnd';

const StateMachineEditorContainer = styled.div`
  flex-grow: 1;
  background-color: #f0f0f0;
  position: relative;
`;

const StateNode = ({ id, left, top, children, onDragStart, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'state',
    item: { id, left, top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    onDragStart: () => onDragStart(id),
  }));

  return (
    <div ref={drag} style={{ position: 'absolute', left, top, opacity: isDragging ? 0.5 : 1, border: '1px solid black', padding: '10px', background: 'white' }} onClick={() => onClick(id)}>
      {children}
    </div>
  );
};

const Connection = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const StateMachineEditor = ({ setActiveState }) => {
  const [states, setStates] = useState([
    { id: 'state_1', left: 50, top: 50, content: 'State 1' },
    { id: 'state_2', left: 200, top: 100, content: 'State 2' },
  ]);
  const [connections, setConnections] = useState([]);
  const [connectingState, setConnectingState] = useState(null);

  const handleDragStart = useCallback((id) => {
    setConnectingState(id);
  }, []);

  const [, drop] = useDrop(() => ({
    accept: 'state',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      setStates(states.map(s => s.id === item.id ? { ...s, left, top } : s));

      if (connectingState && connectingState !== item.id) {
        setConnections([...connections, { from: connectingState, to: item.id }]);
      }
      setConnectingState(null);
    },
  }));

  const getStatePosition = (id) => {
    const state = states.find(s => s.id === id);
    return state ? { x: state.left + 50, y: state.top + 20 } : { x: 0, y: 0 }; // Center of the node
  };

  return (
    <StateMachineEditorContainer ref={drop}>
      {states.map(state => (
        <StateNode key={state.id} id={state.id} left={state.left} top={state.top} onDragStart={handleDragStart} onClick={setActiveState}>
          {state.content}
        </StateNode>
      ))}
      <Connection>
        {connections.map((conn, i) => {
          const fromPos = getStatePosition(conn.from);
          const toPos = getStatePosition(conn.to);
          return (
            <line
              key={i}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke="black"
              strokeWidth="2"
            />
          );
        })}
      </Connection>
    </StateMachineEditorContainer>
  );
};

export default StateMachineEditor;
