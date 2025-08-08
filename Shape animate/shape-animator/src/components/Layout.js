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
  console.log('Layout component rendering');
  const [elements, setElements] = useState([]);
  const [componentDefinitions, setComponentDefinitions] = useState({});
  const [frames, setFrames] = useState([]);
  const [selectedId, selectShape] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameId = useRef(null);

  const selectedElement = elements.find((el) => el.id === selectedId);

  useEffect(() => {
    console.log('Layout - selectedId changed:', selectedId);
    console.log('Layout - elements after selectedId change:', elements);
    console.log('Layout - componentDefinitions after selectedId change:', componentDefinitions);
  }, [selectedId, elements, componentDefinitions]);

  const addFrame = () => {
    const newFrame = {
      type: 'frame',
      id: `frame${frames.length + 1}`,
      x: 0,
      y: 0,
      width: 400,
      height: 300,
      name: `Frame ${frames.length + 1}`,
    };
    setFrames([...frames, newFrame]);
    selectShape(newFrame.id);
  };

  const addRectangle = () => {
    const newRect = {
      type: 'shape-rect',
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: '#1E90FF',
      id: `rect${elements.length + 1}`,
      animation: {},
    };
    setElements([...elements, newRect]);
    selectShape(newRect.id);
  };

  const addCircle = () => {
    const newCircle = {
      type: 'shape-circle',
      x: 150,
      y: 150,
      radius: 50,
      fill: '#FF8C00',
      id: `circle${elements.length + 1}`,
      animation: {},
    };
    setElements([...elements, newCircle]);
    selectShape(newCircle.id);
  };

  const updateElement = (updatedElement) => {
    const updatedElements = elements.slice();
    const index = updatedElements.findIndex((el) => el.id === updatedElement.id);
    updatedElements[index] = updatedElement;
    setElements(updatedElements);
  };

  const updateFrame = (updatedFrame) => {
    setFrames((prevFrames) =>
      prevFrames.map((frame) =>
        frame.id === updatedFrame.id ? updatedFrame : frame
      )
    );
  };

  const createComponentDefinition = () => {
    const selectedElements = elements.filter((el) => el.id === selectedId);
    
    if (selectedElements.length === 0) return;

    const newComponentId = `component${Object.keys(componentDefinitions).length + 1}`;
    const newComponentDefinition = {
      id: newComponentId,
      variants: {
        'default': {
          elements: selectedElements.map(el => ({
            ...el,
            x: el.x - selectedElements[0].x, // Make x relative to component origin
            y: el.y - selectedElements[0].y, // Make y relative to component origin
          })),
        },
      },
    };

    setComponentDefinitions((prevDefs) => {
      const updatedDefs = {
        ...prevDefs,
        [newComponentId]: newComponentDefinition,
      };
      console.log('Layout - createComponentDefinition: Updated componentDefinitions:', updatedDefs);
      return updatedDefs;
    });

    // Replace selected elements with a single component instance
    const newElements = elements.filter((el) => !selectedElements.some(selEl => selEl.id === el.id));
    const newComponentInstance = {
      type: 'component-instance',
      id: `${newComponentId}-instance-${elements.length + 1}`,
      componentId: newComponentId,
      activeVariant: 'default',
      x: selectedElements[0].x, // Take the position of the first selected element
      y: selectedElements[0].y,
      animation: {}, // Component instances can have their own animations
    };
    setElements([...newElements, newComponentInstance]);
    selectShape(newComponentInstance.id);
  };

  console.log('Layout - selectedElement:', selectedElement);
  console.log('Layout - componentDefinitions:', componentDefinitions);

  const createVariant = (componentId, newVariantName) => {
    setComponentDefinitions((prevDefs) => {
      const component = prevDefs[componentId];
      if (!component) return prevDefs;

      const defaultVariantElements = component.variants.default.elements.map(el => ({ ...el, id: `${el.id}-${newVariantName}` }));

      return {
        ...prevDefs,
        [componentId]: {
          ...component,
          variants: {
            ...component.variants,
            [newVariantName]: { elements: defaultVariantElements },
          },
        },
      };
    });
  };

  const addKeyframe = (property, duration, delay, easing) => {

    if (!selectedElement) return;

    const newKeyframe = {
      time: currentTime,
      value: selectedElement[property],
      duration: duration,
      delay: delay,
      easing: easing,
    };

    const animation = selectedElement.animation || {};
    const track = animation[property] || [];

    const updatedTrack = [...track, newKeyframe].sort((a, b) => a.time - b.time);

    updateElement({
      ...selectedElement,
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

  return (
    <Grid>
      <LayerPanelContainer>
        <LayerPanel
          elements={elements}
          selectedId={selectedId}
          onSelect={selectShape}
        />
      </LayerPanelContainer>
      <CanvasContainer>
        <button onClick={addRectangle}>Add Rectangle</button>
        <button onClick={addCircle}>Add Circle</button>
        <button onClick={addFrame}>Add Frame</button>
        <button onClick={createComponentDefinition}>Create Component</button>
        <Canvas
          elements={elements}
          selectedId={selectedId}
          onSelect={selectShape}
          onChange={updateElement}
          currentTime={currentTime}
          componentDefinitions={componentDefinitions}
          canvasSize={{ width: window.innerWidth - 500, height: window.innerHeight - 200 }}
          frames={frames}
          updateFrame={updateFrame}
        />
      </CanvasContainer>
      <InspectorPanelContainer>
        <InspectorPanel
          selectedElement={selectedElement}
          onUpdate={updateElement}
          onAddKeyframe={addKeyframe}
          componentDefinitions={componentDefinitions || {}}
          createVariant={createVariant}
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
          selectedElement={selectedElement}
          currentTime={currentTime}
        />
      </TimelinePanelContainer>
    </Grid>
  );
};

export default Layout;
