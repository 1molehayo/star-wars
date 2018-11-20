import React from "react";
import PropTypes from "prop-types";

class Loader extends React.Component {
  render() {
    const { show, background } = this.props;
    if (show) {
      return (
        <div className="loader-block" style={{ background: background || "transparent" }}>
          <div className="loader">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      );
    }
    return null;
  }
}

Loader.propTypes = {
  show: PropTypes.bool,
  background: PropTypes.string
};

export default Loader;
