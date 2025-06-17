import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  size = "medium", // 'small', 'medium', 'large'
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "modal-sm";
      case "large":
        return "modal-lg";
      default:
        return "";
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content ${getSizeClass()}`}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
