import React, { Component } from "react";
import Characters from "components/Characters";
import Crawl from "components/Crawl";
import Loader from "components/Loader";
import Modal from "components/Modal";
import Select from "components/Select";

import {
  _filterByGender,
  _getMovies,
  _isEmpty,
  _refreshPage,
  _selectMovie,
  _sortCharacters,
  _toggleErrorModal
} from "utility";

import logo from "assets/img/starwars-logo.png";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      errorMessage: "",
      isLoadingCharacters: true,
      isLoadingMovies: true,
      movies: [],
      selectedMovie: {},
      showError: false,
      sortedBy: "name",
      sortAsc: true,
      sumHeights: 0,
      tempCharacters: []
    };
  }

  componentDidMount() {
    _getMovies(this);
  }

  render() {
    return (
      <div className="App">
        <div className="stars" />
        <div className="twinkling" />
        <div className="clouds" />

        <Modal
          showModal={this.state.showError}
          modalFunc={() => _toggleErrorModal(this.state.errorMessage, this)}
          error={this.state.errorMessage}
          refreshFunc={() => _refreshPage()}
        />

        <section className="movie-dropdown">
          <Select
            isLoadingMovies={this.state.isLoadingMovies}
            value={(this.state.selectedMovie && this.state.selectedMovie.title) || ""}
            onSelect={selectedMovie => _selectMovie(selectedMovie, this)}
            movies={this.state.movies}
          />
        </section>

        <section className={`logo ${_isEmpty(this.state.selectedMovie) ? "active" : ""}`}>
          <img src={logo} alt="logo" />
        </section>

        <section className={`movie-info ${_isEmpty(this.state.selectedMovie) ? "" : "active"}`}>
          <Crawl selectedMovie={this.state.selectedMovie} />

          <div className={`characters-block ${_isEmpty(this.state.selectedMovie) ? "" : "active"}`}>
            <Loader show={this.state.isLoadingCharacters} background="#ffc500" />
            <Characters
              characters={this.state.characters}
              filterByGender={e => _filterByGender(e, this)}
              sortAsc={this.state.sortAsc}
              sortCharacters={e => _sortCharacters(e, this)}
              sortedBy={this.state.sortedBy}
              sumHeights={this.state.sumHeights}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default App;
