import React from 'react';
import styled from 'styled-components';

const TimelinePanelContainer = styled.div`
  height: 200px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
`;

const TimelineHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TimelineContent = styled.div`
  display: flex;
  flex-grow: 1;
`;

const LayerList = styled.div`
  width: 250px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`;

import Timeline from './Timeline';

const KeyframeTracks = styled.div`
  flex-grow: 1;
  position: relative;
`;

const TimeMarker = styled.div`
  position: absolute;
  left: ${({ $time }) => $time * 100}px; /* Simple scaling */
  width: 1px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.border};
`;

const CurrentTimeIndicator = styled.div`
  position: absolute;
  left: ${({ $time }) => $time * 100}px; /* Simple scaling */
  width: 2px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const TimelinePanel = ({ keyframes, selectedShape, currentTime, setCurrentTime, addKeyframe }) => {
  const totalDuration = 3; // Mock duration

  return (
    <TimelinePanelContainer>
      <TimelineHeader>
        <div style={{ width: 250, padding: '8px' }}>Load</div>
        <div style={{ flexGrow: 1, position: 'relative', padding: '8px' }}>
          {[...Array(totalDuration + 1).keys()].map((time) => (
            <span key={time} style={{ position: 'absolute', left: time * 100 }}>
              {time}s
            </span>
          ))}
        </div>
      </TimelineHeader>
      <TimelineContent>
        <LayerList>
          {/* This would be populated with the layers from the LayerPanel */}
        </LayerList>
        <KeyframeTracks>
          <Timeline keyframes={keyframes} addKeyframe={addKeyframe} selectedShape={selectedShape} currentTime={currentTime} setCurrentTime={setCurrentTime} />
        </KeyframeTracks>
      </TimelineContent>
    </TimelinePanelContainer>
  );
};

export default TimelinePanel;
