import React from 'react';
import styled from 'styled-components';

const BreakpointsPanelContainer = styled.div`
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const BreakpointsPanel = ({ breakpoints, activeBreakpoint, setBreakpoint }) => {
  return (
    <BreakpointsPanelContainer>
      {breakpoints.map(bp => (
        <button key={bp.id} onClick={() => setBreakpoint(bp.id)} disabled={bp.id === activeBreakpoint}>
          {bp.name} ({bp.width}x{bp.height})
        </button>
      ))}
    </BreakpointsPanelContainer>
  );
};

export default BreakpointsPanel;
