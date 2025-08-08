import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Menu, Share, Download, Settings, HelpCircle, User, ChevronRight, ChevronDown, Eye, Lock, Plus, X } from 'lucide-react';

const AnimationTool = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(2.31);
  const [totalDuration, setTotalDuration] = useState(3.0);
  const [selectedElement, setSelectedElement] = useState('Ball');
  const [expandedItems, setExpandedItems] = useState(['Screen']);
  
  const timelineRef = useRef(null);

  // Mock layer structure
  const layers = [
    {
      id: 'screen',
      name: 'Screen',
      type: 'group',
      children: [
        {
          id: 'mask-group',
          name: 'Mask Group',
          type: 'mask',
          children: [
            { id: 'background-1', name: 'Background', type: 'shape' },
            { id: 'screen-1', name: 'Screen', type: 'shape' }
          ]
        },
        { id: 'rectangle-1', name: 'Rectangle 1', type: 'shape' },
        { id: 'ball', name: 'Ball', type: 'shape' },
        { id: 'background-2', name: 'Background', type: 'shape' },
        { id: 'screen-2', name: 'Screen', type: 'shape' }
      ]
    }
  ];

  // Mock keyframe data
  const keyframes = {
    'Ball': [
      { time: 0.5, property: 'x' },
      { time: 1.0, property: 'scale' },
      { time: 1.5, property: 'y' },
      { time: 2.0, property: 'rotation' },
      { time: 2.5, property: 'opacity' }
    ]
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const formatTime = (time) => {
    return time.toFixed(2);
  };

  const LayerItem = ({ layer, level = 0 }) => {
    const hasChildren = layer.children && layer.children.length > 0;
    const isExpanded = expandedItems.includes(layer.id);
    const isSelected = selectedElement === layer.name;

    return (
      <div>
        <div 
          className={`flex items-center py-1 px-2 hover:bg-gray-700/50 cursor-pointer ${
            isSelected ? 'bg-blue-600/30' : ''
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => setSelectedElement(layer.name)}
        >
          {hasChildren ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(layer.id);
              }}
              className="p-1 hover:bg-gray-600 rounded mr-1"
            >
              {isExpanded ? (
                <ChevronDown size={12} className="text-gray-400" />
              ) : (
                <ChevronRight size={12} className="text-gray-400" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
          
          <div className="flex items-center gap-2 flex-1">
            <Eye size={12} className="text-gray-400" />
            <Lock size={12} className="text-gray-500" />
            <span className="text-sm text-gray-200">{layer.name}</span>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {layer.children.map(child => (
              <LayerItem key={child.id} layer={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const TimelineKeyframes = ({ layerName }) => {
    const layerKeyframes = keyframes[layerName] || [];
    const timelineWidth = 800;
    const pixelsPerSecond = timelineWidth / totalDuration;

    return (
      <div className="relative h-8 bg-gray-800 border-t border-gray-700">
        <div className="text-xs text-gray-400 px-2 py-1">{layerName}</div>
        {layerKeyframes.map((keyframe, index) => (
          <div
            key={index}
            className="absolute top-1 w-2 h-2 bg-blue-400 rounded-full cursor-pointer hover:bg-blue-300"
            style={{ left: `${keyframe.time * pixelsPerSecond}px` }}
            title={`${keyframe.property} at ${keyframe.time}s`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Menu size={20} className="text-gray-400" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Drafts</span>
            <span className="text-gray-400">/</span>
            <span className="text-sm">New</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600">
            Share
          </button>
          <button className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700">
            Export
          </button>
          <Settings size={18} className="text-gray-400 ml-2" />
          <HelpCircle size={18} className="text-gray-400" />
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <User size={14} />
          </div>
          <span className="text-sm text-gray-400">260%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Layers */}
        <div className="w-60 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-gray-700 rounded text-xs">Element</button>
              <button className="px-2 py-1 text-xs text-gray-400">Action 3</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {layers.map(layer => (
              <LayerItem key={layer.id} layer={layer} />
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-700">
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
              <Plus size={16} />
              New Trigger
            </button>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 bg-black relative flex items-center justify-center">
          {/* Grid/Ruler */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 border-b border-gray-700 text-xs text-gray-400 flex items-center">
            {[-100, -75, -50, -25, 0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250].map(num => (
              <div key={num} className="absolute" style={{ left: `${(num + 100) * 4}px` }}>
                {num}
              </div>
            ))}
          </div>
          
          {/* Canvas Content */}
          <div className="relative">
            <div className="w-80 h-80 bg-gray-100 rounded-lg shadow-lg flex items-center justify-center">
              <div 
                className="w-40 h-40 rounded-full"
                style={{ 
                  background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                  transform: `scale(${0.8 + Math.sin(currentTime * 2) * 0.2})`
                }}
              />
            </div>
            
            {/* Playback Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/70 rounded-full px-4 py-2">
              <Menu size={16} className="text-white" />
              <button onClick={togglePlay} className="p-1">
                {isPlaying ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white" />}
              </button>
              <RotateCcw size={16} className="text-white" />
              <span className="text-white text-sm">1x</span>
              <X size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          <div className="text-center text-gray-400 mt-20">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Settings size={24} />
            </div>
            <p className="text-sm">To modify properties,</p>
            <p className="text-sm">select an element.</p>
          </div>
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="h-48 bg-gray-800 border-t border-gray-700">
        {/* Timeline Header */}
        <div className="h-8 bg-gray-750 border-b border-gray-700 flex items-center px-4 text-xs text-gray-400">
          <div className="w-60">Load</div>
          <div className="flex-1 relative">
            {/* Time markers */}
            <div className="flex justify-between">
              {[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map(time => (
                <div key={time} className="text-xs">{time}</div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex">
            <div className="w-60 bg-gray-800 border-r border-gray-700">
              <div className="h-8 flex items-center px-3 text-sm border-b border-gray-700">
                Screen
              </div>
              {['Background', 'Rectangle 1', 'Ball', 'Background', 'Screen'].map((layer, index) => (
                <div key={index} className="h-8 flex items-center px-3 text-xs text-gray-300 border-b border-gray-700/50">
                  {layer}
                </div>
              ))}
            </div>
            
            <div className="flex-1 relative" ref={timelineRef}>
              {/* Current time indicator */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-10"
                style={{ left: `${(currentTime / totalDuration) * 100}%` }}
              />
              
              {/* Timeline tracks */}
              <div className="h-8 bg-gray-700 border-b border-gray-600"></div>
              {['Background', 'Rectangle 1', 'Ball', 'Background', 'Screen'].map((layer, index) => (
                <TimelineKeyframes key={index} layerName={layer} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Timeline Controls */}
        <div className="h-10 bg-gray-750 border-t border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <span className="text-gray-400 text-sm">s</span>
            <span className="text-gray-400 text-sm">/</span>
            <span className="text-sm">{formatTime(totalDuration)}</span>
            <span className="text-gray-400 text-sm">s</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">Select a keyframe</div>
            <div className="text-sm bg-blue-600 px-2 py-1 rounded">{formatTime(currentTime)}</div>
            <div className="text-sm text-gray-400">2.5</div>
            <div className="text-sm text-gray-400">3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationTool;