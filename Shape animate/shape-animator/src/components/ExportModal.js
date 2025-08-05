import React, { useState } from 'react';
import styled from 'styled-components';
import { exportToLottie } from '../utils/lottieExporter';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
`;

const PreviewPanel = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
`;

const ExportModal = ({ show, onClose, shapes, keyframes }) => {
  const [format, setFormat] = useState('lottie');
  const [resolution, setResolution] = useState('1x');
  const [transparent, setTransparent] = useState(false);

  if (!show) {
    return null;
  }

  const handleExport = () => {
    if (format === 'lottie') {
      const lottieData = exportToLottie(shapes, keyframes);
      const blob = new Blob([JSON.stringify(lottieData)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'animation.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Export Animation</h2>
        <div>
          <label>Format:</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="lottie">Lottie (.json)</option>
            <option value="gif">GIF</option>
            <option value="mp4">MP4</option>
          </select>
        </div>
        <div>
          <label>Resolution:</label>
          <select value={resolution} onChange={(e) => setResolution(e.target.value)}>
            <option value="0.5x">0.5x</option>
            <option value="1x">1x</option>
            <option value="2x">2x</option>
          </select>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
            Transparent Background
          </label>
        </div>
        <PreviewPanel>
          <p>File size: 123 KB</p>
          <p>Dimensions: 800x600</p>
        </PreviewPanel>
        <button onClick={handleExport}>Export</button>
        <button onClick={onClose}>Close</button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ExportModal;
