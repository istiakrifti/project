import React from 'react';
import './CustomAlert.css'; // Create a CSS file for styling

const CustomAlert = ({ message, onClose, type }) => {
  // Define CSS classes based on the type (e.g., success, error)
  const alertClasses = `custom-alert ${type}`;

  return (
    <div className={alertClasses}>
      <div className="alert-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default CustomAlert;
