import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

const TIMELINE_TOTAL_WIDTH = 1000; // pixels for 250 frames

const TimelineContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  position: relative;
`;

const TimelineHeader = styled.div`
  position: relative;
  height: 20px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  margin-left: 80px; /* Align with property labels */
  width: ${TIMELINE_TOTAL_WIDTH}px;
`;

const TimeMarker = styled.div`
  position: absolute;
  left: ${({ frame }) => (frame / 250) * TIMELINE_TOTAL_WIDTH}px;
  transform: translateX(-50%);
  font-size: 0.8em;
  color: ${({ theme }) => theme.colors.textSecondary};

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -5px;
    width: 1px;
    height: 5px;
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const Playhead = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ currentTime }) => 80 + (currentTime / 250) * TIMELINE_TOTAL_WIDTH}px; /* 80px for property label offset */
  width: 2px;
  background-color: ${theme.colors.primary};
  z-index: 10;
`;

const TimelineRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PropertyLabel = styled.div`
  width: 80px;
  flex-shrink: 0;
`;

const Keyframe = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.secondary};
  position: absolute;
  left: ${({ time }) => (time / 250) * TIMELINE_TOTAL_WIDTH}px;
  transform: translateX(-50%);
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.primaryDark};
  z-index: 5;
`;

const TimelineTrack = styled.div`
  position: relative;
  flex-grow: 1;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  width: ${TIMELINE_TOTAL_WIDTH}px;
`;

const TimelinePanel = ({ selectedShape, currentTime }) => {
  const frames = Array.from({ length: 251 }, (_, i) => i);

  if (!selectedShape) {
    return <div style={{ padding: `0 ${theme.spacing.md}` }}><h3>Timeline</h3><p>No shape selected</p></div>;
  }

  const propertiesToDisplay = ['x', 'y', 'fill'];
  if (selectedShape.type === 'rect') {
    propertiesToDisplay.push('width', 'height');
  } else if (selectedShape.type === 'circle') {
    propertiesToDisplay.push('radius');
  }

  return (
    <TimelineContainer>
      <h3>Timeline</h3>
      <TimelineHeader>
        {frames.map((frame) => (
          frame % 25 === 0 && <TimeMarker key={frame} frame={frame}>{frame}</TimeMarker>
        ))}
      </TimelineHeader>
      <Playhead currentTime={currentTime} />
      {propertiesToDisplay.map((key) => {
        return (
          <TimelineRow key={key}>
            <PropertyLabel>{key}</PropertyLabel>
            <TimelineTrack>
              {selectedShape.animation &&
                selectedShape.animation[key] &&
                selectedShape.animation[key].map((k, i) => (
                  <Keyframe key={i} time={k.time} />
                ))}
            </TimelineTrack>
          </TimelineRow>
        );
      })}
    </TimelineContainer>
  );
};

export default TimelinePanel;
