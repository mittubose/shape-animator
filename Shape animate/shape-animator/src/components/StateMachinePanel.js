import React, { useState } from 'react';
import styled from 'styled-components';
import StateMachineEditor from './StateMachineEditor';

const StateMachinePanelContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Controls = styled.div`
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const StateMachinePanel = ({ setActiveState, addState, addTransition, states, transitions }) => {
  const [newStateName, setNewStateName] = useState('');
  const [fromState, setFromState] = useState('');
  const [toState, setToState] = useState('');
  const [trigger, setTrigger] = useState('click');

  const handleAddState = () => {
    if (newStateName) {
      addState(newStateName);
      setNewStateName('');
    }
  };

  const handleAddTransition = () => {
    if (fromState && toState) {
      addTransition(fromState, toState, trigger);
    }
  };

  return (
    <StateMachinePanelContainer>
      <Controls>
        <input type="text" value={newStateName} onChange={(e) => setNewStateName(e.target.value)} placeholder="New State Name" />
        <button onClick={handleAddState}>Add State</button>
        <select value={fromState} onChange={(e) => setFromState(e.target.value)}>
          <option value="">From State</option>
          {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={toState} onChange={(e) => setToState(e.target.value)}>
          <option value="">To State</option>
          {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={trigger} onChange={(e) => setTrigger(e.target.value)}>
          <option value="click">Click</option>
          <option value="hover">Hover</option>
        </select>
        <button onClick={handleAddTransition}>Add Transition</button>
      </Controls>
      <StateMachineEditor setActiveState={setActiveState} states={states} transitions={transitions} />
    </StateMachinePanelContainer>
  );
};

export default StateMachinePanel;
