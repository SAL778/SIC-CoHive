import React from 'react';
import './SignOutModal.css';

const ModalComponent = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Confirm Sign Out</h2>
        <p>Are you sure you want to sign out?</p>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default ModalComponent;
