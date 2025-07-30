import React, { useEffect, useRef } from 'react';
import { Circle, Transformer } from 'react-konva';
import Konva from 'konva';

const CircleShape = ({ shapeProps, isSelected, onSelect, onChange, currentTime }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (shapeProps.animation) {
      Object.keys(shapeProps.animation).forEach((prop) => {
        const keyframes = shapeProps.animation[prop];
        if (keyframes.length === 0) return;

        let interpolatedValue = keyframes[0].value; // Default to first keyframe value

        if (prop === 'fill') {
          // For colors, find the last keyframe whose time is <= currentTime
          let activeKeyframe = keyframes[0];
          for (let i = 0; i < keyframes.length; i++) {
            if (keyframes[i].time <= currentTime) {
              activeKeyframe = keyframes[i];
            } else {
              break;
            }
          }
          interpolatedValue = activeKeyframe.value;
        } else if (keyframes.length === 1) {
          interpolatedValue = keyframes[0].value;
        } else {
          let kf1 = null;
          let kf2 = null;

          // Find the two keyframes to interpolate between
          for (let i = 0; i < keyframes.length; i++) {
            if (keyframes[i].time <= currentTime) {
              kf1 = keyframes[i];
            }
            if (keyframes[i].time > currentTime) {
              kf2 = keyframes[i];
              break;
            }
          }

          if (!kf1) {
            // Current time is before the first keyframe
            interpolatedValue = keyframes[0].value;
          } else if (!kf2) {
            // Current time is after the last keyframe
            interpolatedValue = keyframes[keyframes.length - 1].value;
          } else {
            // Interpolate between kf1 and kf2
            const animationStartTime = kf1.time + (kf1.delay || 0);
            const animationEndTime = animationStartTime + (kf1.duration || 0);

            if (currentTime < animationStartTime) {
              interpolatedValue = kf1.value;
            } else if (currentTime > animationEndTime) {
              interpolatedValue = kf2.value;
            } else {
              const t = (currentTime - animationStartTime) / (kf1.duration || 1); // Avoid division by zero
              const easingFunction = Konva.Easings[kf1.easing] || Konva.Easings.Linear;
              const easedT = easingFunction(t);
              interpolatedValue = kf1.value + easedT * (kf2.value - kf1.value);
            }
          }
        }
        shapeRef.current.setAttr(prop, interpolatedValue);
      });
      shapeRef.current.getLayer().batchDraw();
    }
  }, [currentTime, shapeProps.animation]);

  return (
    <React.Fragment>
      <Circle
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            radius: Math.max(5, node.radius() * scaleX),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default CircleShape;

