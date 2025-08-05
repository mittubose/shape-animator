import React from 'react';
import styled from 'styled-components';
import Timeline from './Timeline';

const TimelinePanelContainer = styled.div`
  height: 200px;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
`;

const TimelinePanel = ({ keyframes }) => {
  return (
    <TimelinePanelContainer tabIndex={0} aria-label="Timeline panel">
      <Timeline keyframes={keyframes} />
    </TimelinePanelContainer>
  );
};

export default TimelinePanel;
