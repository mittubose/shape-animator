import React, { useRef, useEffect } from 'react';
import { Group, Transformer } from 'react-konva';
import Konva from 'konva';
import Rectangle from './Rectangle';
import CircleShape from './Circle';

const ComponentInstance = ({ instanceProps, componentDefinitions, isSelected, onSelect, onChange, currentTime, canvasWidth, canvasHeight }) => {
  const groupRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (instanceProps.animation) {
      Object.keys(instanceProps.animation).forEach((prop) => {
        const keyframes = instanceProps.animation[prop];
        if (keyframes.length === 0) return;

        let interpolatedValue = shapeProps[prop]; // Start with current value

        if (prop === 'fill') {
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
            interpolatedValue = keyframes[0].value;
          } else if (!kf2) {
            interpolatedValue = keyframes[keyframes.length - 1].value;
          } else {
            const animationStartTime = kf1.time + (kf1.delay || 0);
            const animationEndTime = animationStartTime + (kf1.duration || 0);

            if (currentTime < animationStartTime) {
              interpolatedValue = kf1.value;
            } else if (currentTime > animationEndTime) {
              interpolatedValue = kf2.value;
            } else {
              const t = (currentTime - animationStartTime) / (kf1.duration || 1);
              const easingFunction = Konva.Easings[kf1.easing] || Konva.Easings.Linear;
              const easedT = easingFunction(t);
              interpolatedValue = kf1.value + easedT * (kf2.value - kf1.value);
            }
          }
        }
        groupRef.current.setAttr(prop, interpolatedValue);
      });
      groupRef.current.getLayer().batchDraw();
    }
  }, [currentTime, instanceProps.animation]);

  const componentDefinition = componentDefinitions[instanceProps.componentId];
  const activeVariantElements = componentDefinition.variants[instanceProps.activeVariant].elements;

  if (!componentDefinition || !activeVariantElements) {
    return null; // Or render a placeholder for missing definition or variant
  }

  return (
    <React.Fragment>
      <Group
        x={instanceProps.x}
        y={instanceProps.y}
        scaleX={instanceProps.scaleX || 1}
        scaleY={instanceProps.scaleY || 1}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={groupRef}
        onDragEnd={(e) => {
          const newX = Math.max(0, Math.min(e.target.x(), canvasWidth - (groupRef.current.width() * groupRef.current.scaleX())));
          const newY = Math.max(0, Math.min(e.target.y(), canvasHeight - (groupRef.current.height() * groupRef.current.scaleY())));
          onChange({
            ...instanceProps,
            x: newX,
            y: newY,
          });
        }}
        onTransformEnd={(e) => {
          const node = groupRef.current;
          const scaleX = Math.max(0.1, node.scaleX());
          const scaleY = Math.max(0.1, node.scaleY());

          const newWidth = node.width() * scaleX;
          const newHeight = node.height() * scaleY;

          const newX = Math.max(0, Math.min(node.x(), canvasWidth - newWidth));
          const newY = Math.max(0, Math.min(node.y(), canvasHeight - newHeight));

          onChange({
            ...instanceProps,
            x: newX,
            y: newY,
            scaleX: scaleX,
            scaleY: scaleY,
          });
        }}
      >
        {activeVariantElements.map((element) => {
          if (element.type === 'shape-rect') {
            return (
              <Rectangle
                key={element.id}
                shapeProps={{
                  ...element,
                  x: element.x, // These are already relative to the component's origin
                  y: element.y,
                }}
                isSelected={false}
                onSelect={() => {}}
                onChange={() => {}}
                currentTime={currentTime}
              />
            );
          } else if (element.type === 'shape-circle') {
            return (
              <CircleShape
                key={element.id}
                shapeProps={{
                  ...element,
                  x: element.x, // These are already relative to the component's origin
                  y: element.y,
                }}
                isSelected={false}
                onSelect={() => {}}
                onChange={() => {}}
                currentTime={currentTime}
              />
            );
          }
          return null;
        })}
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // This function is for visual bounding box, actual clamping is done in onTransformEnd
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default ComponentInstance;

