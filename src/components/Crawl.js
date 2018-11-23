import React from "react";
import PropTypes from "prop-types";
import { _isEmpty } from "utility";

class Crawl extends React.Component {
  render() {
    return (
      <div className={`crawl ${_isEmpty(this.props.selectedMovie) ? "" : "animate"}`}>
        <h3 className="movie-theme">Star Wars</h3>
        <p className="movie-episode">{`Episode ${this.props.selectedMovie.episode_id}`}</p>
        <h5 className="movie-title">{this.props.selectedMovie.title}</h5>
        <br />
        <p className="content">{this.props.selectedMovie.opening_crawl}</p>
      </div>
    );
  }
}

Crawl.propTypes = {
  selectedMovie: PropTypes.object
};

export default Crawl;
