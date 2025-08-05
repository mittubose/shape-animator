import React from 'react';
import styled from 'styled-components';
import StateMachineEditor from './StateMachineEditor';

const StateMachinePanelContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const StateMachinePanel = ({ setActiveState }) => {
  return (
    <StateMachinePanelContainer>
      <StateMachineEditor setActiveState={setActiveState} />
    </StateMachinePanelContainer>
  );
};

export default StateMachinePanel;
