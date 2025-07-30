import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

const InspectorPanel = ({ selectedShape, onUpdate, onAddKeyframe }) => {
  const [keyframeDuration, setKeyframeDuration] = useState(0);
  const [keyframeDelay, setKeyframeDelay] = useState(0);
  const [keyframeEasing, setKeyframeEasing] = useState('linear');

  const easingFunctions = [
    'linear',
    'easeInQuad',
    'easeOutQuad',
    'easeInOutQuad',
    'easeInCubic',
    'easeOutCubic',
    'easeInOutCubic',
    'easeInQuart',
    'easeOutQuart',
    'easeInOutQuart',
    'easeInQuint',
    'easeOutQuint',
    'easeInOutQuint',
    'easeInSine',
    'easeOutSine',
    'easeInOutSine',
    'easeInExpo',
    'easeOutExpo',
    'easeInOutExpo',
    'easeInCirc',
    'easeOutCirc',
    'easeInOutCirc',
    'easeInElastic',
    'easeOutElastic',
    'easeInOutElastic',
    'easeInBack',
    'easeOutBack',
    'easeInOutBack',
    'easeInBounce',
    'easeOutBounce',
    'easeInOutBounce',
  ];

  if (!selectedShape) {
    return <div style={{ padding: `0 ${theme.spacing.md}` }}><h3>Inspector</h3><p>No shape selected</p></div>;
  }

  const handleChange = (e) => {
    onUpdate({
      ...selectedShape,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const handleColorChange = (e) => {
    onUpdate({
      ...selectedShape,
      fill: e.target.value,
    });
  };

  const handleAddKeyframe = (property) => {
    onAddKeyframe(property, keyframeDuration, keyframeDelay, keyframeEasing);
  };

  return (
    <div style={{ padding: `0 ${theme.spacing.md}` }}>
      <h3>Inspector</h3>
      <div>
        <label>X</label>
        <input
          type="number"
          name="x"
          value={selectedShape.x}
          onChange={handleChange}
        />
        <button onClick={() => handleAddKeyframe('x')}>Add Keyframe</button>
      </div>
      <div>
        <label>Y</label>
        <input
          type="number"
          name="y"
          value={selectedShape.y}
          onChange={handleChange}
        />
        <button onClick={() => handleAddKeyframe('y')}>Add Keyframe</button>
      </div>
      {selectedShape.type === 'rect' && (
        <>
          <div>
            <label>Width</label>
            <input
              type="number"
              name="width"
              value={selectedShape.width}
              onChange={handleChange}
            />
            <button onClick={() => handleAddKeyframe('width')}>Add Keyframe</button>
          </div>
          <div>
            <label>Height</label>
            <input
              type="number"
              name="height"
              value={selectedShape.height}
              onChange={handleChange}
            />
            <button onClick={() => handleAddKeyframe('height')}>Add Keyframe</button>
          </div>
        </>
      )}
      {selectedShape.type === 'circle' && (
        <div>
          <label>Radius</label>
          <input
            type="number"
            name="radius"
            value={selectedShape.radius}
            onChange={handleChange}
          />
          <button onClick={() => handleAddKeyframe('radius')}>Add Keyframe</button>
        </div>
      )}
      <div>
        <label>Fill</label>
        <input
          type="color"
          value={selectedShape.fill}
          onChange={handleColorChange}
        />
        <button onClick={() => handleAddKeyframe('fill')}>Add Keyframe</button>
      </div>
      <hr />
      <h4>Keyframe Properties</h4>
      <div>
        <label>Duration (frames)</label>
        <input
          type="number"
          value={keyframeDuration}
          onChange={(e) => setKeyframeDuration(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Delay (frames)</label>
        <input
          type="number"
          value={keyframeDelay}
          onChange={(e) => setKeyframeDelay(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Easing</label>
        <select
          value={keyframeEasing}
          onChange={(e) => setKeyframeEasing(e.target.value)}
        >
          {easingFunctions.map((easing) => (
            <option key={easing} value={easing}>
              {easing}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InspectorPanel;
