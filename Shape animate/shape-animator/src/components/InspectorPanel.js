import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const InspectorPanelContainer = styled.div`
  width: 250px;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
  padding: 10px;
`;

const SectionTitle = styled.h3`
  margin-top: 0;
`;

const InspectorPanel = ({ addKeyframe, addTrigger, states, selectedShape, setShapeConstraints, addVariable, variables }) => {
  const [fromState, setFromState] = useState('');
  const [toState, setToState] = useState('');
  const [trigger, setTrigger] = useState('click');
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState('EaseInOut');
  const [constraints, setConstraints] = useState({ left: true, top: true, right: false, bottom: false });
  const [variableName, setVariableName] = useState('');
  const [variableValue, setVariableValue] = useState('');

  useEffect(() => {
    if (selectedShape) {
      // Assuming shape object has constraints property
      // setConstraints(selectedShape.constraints);
    }
  }, [selectedShape]);

  const handleAddTrigger = () => {
    addTrigger(fromState, toState, trigger, { duration, delay, easing });
  };

  const handleConstraintChange = (e) => {
    const { name, checked } = e.target;
    const newConstraints = { ...constraints, [name]: checked };
    setConstraints(newConstraints);
    setShapeConstraints(selectedShape, newConstraints);
  };

  const handleAddVariable = () => {
    addVariable(variableName, variableValue);
    setVariableName('');
    setVariableValue('');
  };

  return (
    <InspectorPanelContainer tabIndex={0} aria-label="Inspector panel">
      <SectionTitle>Animation</SectionTitle>
      <button onClick={() => addKeyframe('x')} aria-label="Add X Keyframe">Add X Keyframe</button>
      <button onClick={() => addKeyframe('y')} aria-label="Add Y Keyframe">Add Y Keyframe</button>
      <SectionTitle>State Machine</SectionTitle>
      <div>
        <label htmlFor="fromState">From:</label>
        <select id="fromState" value={fromState} onChange={(e) => setFromState(e.target.value)} aria-label="From state">
          {states.map(state => <option key={state.id} value={state.id}>{state.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="toState">To:</label>
        <select id="toState" value={toState} onChange={(e) => setToState(e.target.value)} aria-label="To state">
          {states.map(state => <option key={state.id} value={state.id}>{state.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="trigger">Trigger:</label>
        <select id="trigger" value={trigger} onChange={(e) => setTrigger(e.target.value)} aria-label="Trigger type">
          <option value="click">Click</option>
          <option value="hover">Hover</option>
          <option value="mouse-follow">Mouse Follow</option>
          <option value="cursor-based">Cursor-Based</option>
        </select>
      </div>
      <div>
        <label htmlFor="duration">Duration:</label>
        <input id="duration" type="number" value={duration} onChange={(e) => setDuration(parseFloat(e.target.value))} aria-label="Duration" />
      </div>
      <div>
        <label htmlFor="delay">Delay:</label>
        <input id="delay" type="number" value={delay} onChange={(e) => setDelay(parseFloat(e.target.value))} aria-label="Delay" />
      </div>
      <div>
        <label htmlFor="easing">Easing:</label>
        <select id="easing" value={easing} onChange={(e) => setEasing(e.target.value)} aria-label="Easing function">
          <option value="EaseInOut">EaseInOut</option>
          <option value="Linear">Linear</option>
          <option value="EaseIn">EaseIn</option>
          <option value="EaseOut">EaseOut</option>
        </select>
      </div>
      <button onClick={handleAddTrigger} aria-label="Add Trigger">Add Trigger</button>
      <SectionTitle>Constraints</SectionTitle>
      <div>
        <label>
          <input type="checkbox" name="left" checked={constraints.left} onChange={handleConstraintChange} aria-label="Left constraint" />
          Left
        </label>
        <label>
          <input type="checkbox" name="right" checked={constraints.right} onChange={handleConstraintChange} aria-label="Right constraint" />
          Right
        </label>
        <label>
          <input type="checkbox" name="top" checked={constraints.top} onChange={handleConstraintChange} aria-label="Top constraint" />
          Top
        </label>
        <label>
          <input type="checkbox" name="bottom" checked={constraints.bottom} onChange={handleConstraintChange} aria-label="Bottom constraint" />
          Bottom
        </label>
      </div>
      <SectionTitle>Variables</SectionTitle>
      <div>
        <input type="text" placeholder="Name" value={variableName} onChange={(e) => setVariableName(e.target.value)} aria-label="Variable name" />
        <input type="text" placeholder="Value" value={variableValue} onChange={(e) => setVariableValue(e.target.value)} aria-label="Variable value" />
        <button onClick={handleAddVariable} aria-label="Add Variable">Add Variable</button>
      </div>
      <ul>
        {Object.entries(variables).map(([name, value]) => (
          <li key={name}>{name}: {value}</li>
        ))}
      </ul>
    </InspectorPanelContainer>
  );
};

export default InspectorPanel;
