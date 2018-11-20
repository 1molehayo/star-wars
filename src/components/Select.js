import React from "react";
import Loader from "./Loader";
import PropTypes from "prop-types";

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownStatus: false
    };
    this.toggleFilter = this.toggleFilter.bind(this);
    this.changeInputValue = this.changeInputValue.bind(this);
  }

  changeInputValue(selectedMovie) {
    this.props.onSelect(selectedMovie);
    this.toggleFilter();
  }

  toggleFilter() {
    this.setState({ dropdownStatus: !this.state.dropdownStatus });
  }

  render() {
    return (
      <div className="select">
        <div className={`dropdown ${this.state.dropdownStatus ? "show" : ""}`}>
          <div className="dropdown__content">
            <div className="dropdown-list">
              {this.props.movies.map((movie, y) => (
                <p className="item" key={y} onClick={() => this.changeInputValue(movie)}>
                  {movie.title}
                </p>
              ))}
            </div>
          </div>
        </div>
        <Loader show={this.props.isLoadingMovies} />
        <button
          className="button select-button"
          data-id="location"
          onClick={this.toggleFilter}
          disabled={this.props.isLoadingMovies ? "disabled" : ""}
        >
          <div className={`content ${this.props.isLoadingMovies ? "hide" : ""}`}>
            <div className="input">
              <input className="title" placeholder="Choose a star wars movie" value={this.props.value} disabled />
            </div>
            <div className="icon">
              <i className={`fas ${this.state.dropdownStatus ? "fa-caret-up" : "fa-caret-down"}`} />
            </div>
          </div>
        </button>
      </div>
    );
  }
}

Select.propTypes = {
  isLoadingMovies: PropTypes.bool,
  movies: PropTypes.array
};
export default Select;
