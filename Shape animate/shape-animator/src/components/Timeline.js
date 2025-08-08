import React from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { PlusCircle } from '@phosphor-icons/react';

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
  cursor: ew-resize;
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

const Timeline = ({ keyframes, addKeyframe, selectedShape, currentTime, setCurrentTime }) => {
  const handleDrag = (e, ui) => {
    const newTime = Math.max(0, currentTime + ui.deltaX);
    setCurrentTime(newTime);
  };

  return (
    <TimelineContainer>
      <TimelineHeader>
        Timeline - {currentTime.toFixed(2)}s
        {selectedShape && (
          <>
            <button onClick={() => addKeyframe('x', currentTime)}><PlusCircle size={16} /> Add X Keyframe</button>
            <button onClick={() => addKeyframe('y', currentTime)}><PlusCircle size={16} /> Add Y Keyframe</button>
          </>
        )}
      </TimelineHeader>
      <TimelineContent>
        <Draggable axis="x" onDrag={handleDrag} position={{ x: currentTime, y: 0 }}>
          <Playhead position={currentTime} />
        </Draggable>
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
