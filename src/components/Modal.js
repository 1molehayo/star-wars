import React from "react";
import PropTypes from "prop-types";

class Modal extends React.Component {
  render() {
    const { error, modalFunc, refreshFunc, showModal } = this.props;
    if (showModal) {
      return (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-close" onClick={modalFunc}>
              <i className="fas fa-times" />
            </div>
            <div className="modal-header">404 Error !</div>
            <div className="modal-body">
              <p className="modal-description">{error}</p>
              <p>Please reload the page.</p>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={refreshFunc}>
                Refresh page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

Modal.propTypes = {
  error: PropTypes.string,
  modalFunc: PropTypes.func,
  refreshFunc: PropTypes.func,
  showModal: PropTypes.bool
};

export default Modal;
