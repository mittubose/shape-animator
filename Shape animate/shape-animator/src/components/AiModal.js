import React, { useState } from 'react';
import styled from 'styled-components';

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

const AiModal = ({ show, onClose, onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [generationType, setGenerationType] = useState('rectangle');

  if (!show) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Generate with AI</h2>
        <select value={generationType} onChange={(e) => setGenerationType(e.target.value)} disabled={isLoading}>
          <option value="rectangle">Rectangle</option>
          <option value="button">Button</option>
          <option value="card">Card</option>
        </select>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ width: '100%', height: '100px' }} disabled={isLoading} />
        <button onClick={() => onGenerate(prompt, generationType)} disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate'}</button>
        <button onClick={onClose} disabled={isLoading}>Close</button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AiModal;
