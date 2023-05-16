import React from 'react';
import styled from 'styled-components';

const PopupWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background-color: ${props => (props.success ? 'green' : 'red')};
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const CloseButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  margin-top: 0.5rem;
  cursor: pointer;
`;

const Popup = ({ success, onClose, text }) => {
  return (
    <PopupWrapper>
      <PopupContent success={success}>
        <p>{success ? `${text} Successfull`  : `${text} Failed!`}</p>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </PopupContent>
    </PopupWrapper>
  );
};

export default Popup;
