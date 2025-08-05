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

  if (!show) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Generate with AI</h2>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ width: '100%', height: '100px' }} disabled={isLoading} />
        <button onClick={() => onGenerate(prompt)} disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate'}</button>
        <button onClick={onClose} disabled={isLoading}>Close</button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AiModal;
