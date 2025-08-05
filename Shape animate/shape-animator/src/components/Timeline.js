import React from 'react';
import styled from 'styled-components';

const TimelineContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TimelineHeader = styled.div`
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const TimelineContent = styled.div`
  flex-grow: 1;
  position: relative;
`;

const Playhead = styled.div`
  position: absolute;
  left: ${({ position }) => position}px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: red;
`;

const Track = styled.div`
  position: relative;
  height: 30px;
  border-bottom: 1px solid #eee;
`;

const Keyframe = styled.div`
  position: absolute;
  left: ${({ time }) => time * 100}px; /* Simple scaling for now */
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background-color: blue;
`;

const Timeline = ({ keyframes }) => {
  return (
    <TimelineContainer>
      <TimelineHeader>Timeline</TimelineHeader>
      <TimelineContent>
        <Playhead position={100} />
        {Object.keys(keyframes).map((shapeId) => (
          <div key={shapeId}>
            <h4>{shapeId}</h4>
            {Object.keys(keyframes[shapeId]).map((property) => (
              <Track key={property}>
                {keyframes[shapeId][property].map((keyframe, i) => (
                  <Keyframe key={i} time={keyframe.time} />
                ))}
              </Track>
            ))}
          </div>
        ))}
      </TimelineContent>
    </TimelineContainer>
  );
};

export default Timeline;
