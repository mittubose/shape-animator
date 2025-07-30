import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Canvas from './Canvas';
import LayerPanel from './LayerPanel';
import InspectorPanel from './InspectorPanel';
import TimelinePanel from './TimelinePanel';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  grid-template-rows: 1fr 200px;
  height: 100vh;
  width: 100vw;
`;

const Panel = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const LayerPanelContainer = styled(Panel)`
  grid-column: 1 / 2;
  grid-row: 1 / 3;
`;

const CanvasContainer = styled(Panel)`
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  overflow: hidden;
`;

const InspectorPanelContainer = styled(Panel)`
  grid-column: 3 / 4;
  grid-row: 1 / 3;
`;

const TimelinePanelContainer = styled(Panel)`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: column;
`;

const TimelineControls = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
`;

const TimelineSlider = styled.input`
  width: 100%;
`;

const Layout = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedId, selectShape] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameId = useRef(null);

  const addRectangle = () => {
    const newRect = {
      type: 'rect',
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: '#1E90FF',
      id: `rect${shapes.length + 1}`,
      animation: {},
    };
    setShapes([...shapes, newRect]);
    selectShape(newRect.id);
  };

  const addCircle = () => {
    const newCircle = {
      type: 'circle',
      x: 150,
      y: 150,
      radius: 50,
      fill: '#FF8C00',
      id: `circle${shapes.length + 1}`,
      animation: {},
    };
    setShapes([...shapes, newCircle]);
    selectShape(newCircle.id);
  };

  const updateShape = (updatedShape) => {
    const updatedShapes = shapes.slice();
    const index = updatedShapes.findIndex((s) => s.id === updatedShape.id);
    updatedShapes[index] = updatedShape;
    setShapes(updatedShapes);
  };

  const addKeyframe = (property, duration, delay, easing) => {
    const selectedShape = shapes.find((s) => s.id === selectedId);
    if (!selectedShape) return;

    const newKeyframe = {
      time: currentTime,
      value: selectedShape[property],
      duration: duration,
      delay: delay,
      easing: easing,
    };

    const animation = selectedShape.animation || {};
    const track = animation[property] || [];

    const updatedTrack = [...track, newKeyframe].sort((a, b) => a.time - b.time);

    updateShape({
      ...selectedShape,
      animation: {
        ...animation,
        [property]: updatedTrack,
      },
    });
  };

  const animate = useCallback(() => {
    setCurrentTime((prevTime) => {
      if (prevTime >= 250) {
        return 0; // Loop back to the beginning
      }
      return prevTime + 1;
    });
    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      cancelAnimationFrame(animationFrameId.current);
    } else {
      setIsPlaying(true);
      animationFrameId.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  const selectedShape = shapes.find((s) => s.id === selectedId);

  return (
    <Grid>
      <LayerPanelContainer>
        <LayerPanel
          shapes={shapes}
          selectedId={selectedId}
          onSelect={selectShape}
        />
      </LayerPanelContainer>
      <CanvasContainer>
        <button onClick={addRectangle}>Add Rectangle</button>
        <button onClick={addCircle}>Add Circle</button>
        <Canvas
          shapes={shapes}
          selectedId={selectedId}
          onSelect={selectShape}
          onChange={updateShape}
          currentTime={currentTime}
        />
      </CanvasContainer>
      <InspectorPanelContainer>
        <InspectorPanel
          selectedShape={selectedShape}
          onUpdate={updateShape}
          onAddKeyframe={addKeyframe}
        />
      </InspectorPanelContainer>
      <TimelinePanelContainer>
        <TimelineControls>
          <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
          <TimelineSlider
            type="range"
            min="0"
            max="250"
            value={currentTime}
            onChange={(e) => setCurrentTime(parseInt(e.target.value))}
          />
        </TimelineControls>
        <TimelinePanel
          selectedShape={selectedShape}
          currentTime={currentTime}
        />
      </TimelinePanelContainer>
    </Grid>
  );
};

export default Layout;
