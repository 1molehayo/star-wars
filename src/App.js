import React, { Component } from "react";
import Loader from "components/Loader";
import Modal from "components/Modal";
import Select from "components/Select";
import axios from "axios";
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

    this.filterByGender = this.filterByGender.bind(this);
    this.getMovies = this.getMovies.bind(this);
    this.getCharacters = this.getCharacters.bind(this);
    this.selectMovie = this.selectMovie.bind(this);
    this.sortCharacters = this.sortCharacters.bind(this);
    this.sortMovies = this.sortMovies.bind(this);
    this.sumHeights = this.sumHeights.bind(this);
    this.toggleErrorModal = this.toggleErrorModal.bind(this);
  }

  _refreshPage() {
    window.location.reload();
  }

  componentDidMount() {
    this.getMovies();
  }

  filterByGender(event) {
    let { characters, tempCharacters, sumHeights } = this.state;
    characters = [];
    if (event.target.value === "all") {
      characters = [...tempCharacters];
      sumHeights = this.sumHeights(characters);
    } else if (event.target.value === "unknown") {
      characters = tempCharacters.filter(character => character.gender.toLowerCase() === "n/a");
      sumHeights = this.sumHeights(characters);
    } else {
      characters = tempCharacters.filter(character => character.gender.toLowerCase() === event.target.value);
      sumHeights = this.sumHeights(characters);
    }

    this.setState({ characters, sumHeights });
  }

  getMovies() {
    let { movies } = this.state;
    axios
      .get("https://swapi.co/api/films/")
      .then(response => {
        movies = this.sortMovies(response.data.results);
        this.setState({ isLoadingMovies: false, movies });
      })
      .catch(() => {
        this.toggleErrorModal("There was an error while loading the movies");
      });
  }

  getCharacters(movie) {
    this.setState({ characters: [], tempCharacters: [], sumHeights: 0, isLoadingCharacters: true });
    movie.characters.forEach(api => {
      axios
        .get(api)
        .then(response => {
          this.setState(prevState => {
            let characters = [...prevState.characters, response.data];
            let tempCharacters = [...prevState.characters, response.data];
            let sumHeights = this.sumHeights(characters);
            let isLoadingCharacters = true;
            if (characters.length > 0) {
              isLoadingCharacters = false;
            }
            return { characters, isLoadingCharacters, tempCharacters, sumHeights };
          });
          this.sortCharactersByName();
        })
        .catch(() => {
          this.toggleErrorModal("There was an error while loading the movie characters");
        });
    });
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  selectMovie(selectedMovie) {
    this.setState({ selectedMovie: {} }, () =>
      setTimeout(() => {
        this.getCharacters(selectedMovie);
        this.setState({ selectedMovie });
      }, 0)
    );
  }

  sortMovies(movies) {
    return movies.sort((a, b) => {
      const dateA = new Date(a.release_date),
        dateB = new Date(b.release_date);
      return dateA - dateB;
    });
  }

  sortCharacters(event) {
    const { id } = event.currentTarget.dataset;
    const { sortedBy } = this.state;
    if (sortedBy !== id) {
      this.setState({ sortAsc: true }, () => {
        this.sortCheck(id, true);
      });
    } else {
      this.setState(
        prevState => ({ sortAsc: !prevState.sortAsc }),
        () => {
          this.sortCheck(id, this.state.sortAsc);
        }
      );
    }
  }

  sortCheck(id, sortAsc) {
    if (id === "name") {
      this.sortCharactersByName(!sortAsc);
    }
    if (id === "gender") {
      this.sortCharactersByGender(!sortAsc);
    }
    if (id === "height") {
      this.sortCharactersByHeight(!sortAsc);
    }
  }

  sortCharactersByGender(reverse) {
    let { characters, sortedBy } = this.state;
    sortedBy = "gender";
    characters.sort((a, b) => {
      const nameA = a.gender.toLowerCase(),
        nameB = b.gender.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    if (reverse) {
      characters.reverse();
    }
    this.setState({ characters, sortedBy });
  }

  sortCharactersByHeight(reverse) {
    let { characters, sortedBy } = this.state;
    sortedBy = "height";
    characters.sort((a, b) => {
      return a.height - b.height;
    });
    if (reverse) {
      characters.reverse();
    }
    this.setState({ characters, sortedBy });
  }

  sortCharactersByName(reverse) {
    let { characters, sortedBy } = this.state;
    sortedBy = "name";
    characters.sort((a, b) => {
      const nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    if (reverse) {
      characters.reverse();
    }
    this.setState({ characters, sortedBy });
  }

  sumHeights(characters) {
    let sum = 0;
    for (let index = 0; index < characters.length; index++) {
      sum += parseInt(characters[index].height, 10) || 0;
    }
    // convert sum to feet and inches
    const feet = Math.floor(sum / 30.48);
    const inches = (((sum / 30.48) % 1) * 12).toFixed(2);
    let string = "";
    parseInt(inches, 10) !== 0
      ? (string = sum + " cm (" + feet + "ft/" + inches + "in)")
      : (string = sum + " cm (" + feet + "ft)");
    return string;
  }

  toggleErrorModal(error) {
    this.setState(prevState => ({ showError: !prevState.showError, errorMessage: error }));
  }

  render() {
    return (
      <div className="App">
        <div className="stars" />
        <div className="twinkling" />
        <div className="clouds" />

        <Modal
          showModal={this.state.showError}
          modalFunc={this.toggleErrorModal}
          error={this.state.errorMessage}
          refreshFunc={this._refreshPage}
        />

        <section className="movie-dropdown">
          <Select
            isLoadingMovies={this.state.isLoadingMovies}
            value={(this.state.selectedMovie && this.state.selectedMovie.title) || ""}
            onSelect={this.selectMovie}
            movies={this.state.movies}
          />
        </section>

        <section className={`logo ${this.isEmpty(this.state.selectedMovie) ? "active" : ""}`}>
          <img src={logo} alt="logo" />
        </section>

        <section className={`movie-info ${this.isEmpty(this.state.selectedMovie) ? "" : "active"}`}>
          <div className={`crawl ${this.isEmpty(this.state.selectedMovie) ? "" : "animate"}`}>
            <h3 className="movie-theme">Star Wars</h3>
            <p className="movie-episode">{`Episode ${this.state.selectedMovie.episode_id}`}</p>
            <h5 className="movie-title">{this.state.selectedMovie.title}</h5>
            <br />
            <p className="content">{this.state.selectedMovie.opening_crawl}</p>
          </div>
          <div className={`characters-block ${this.isEmpty(this.state.selectedMovie) ? "" : "active"}`}>
            <Loader show={this.state.isLoadingCharacters} background="#ffc500" />
            <div className="characters">
              <h5 className="characters-heading">Character List</h5>
              <div className="gender-select-block">
                <select className="gender-select" onChange={this.filterByGender}>
                  <option value="all">All Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="hermaphrodite">Hermaphrodite</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th data-id="name" onClick={this.sortCharacters}>
                      Name
                      <i
                        className={`fas ${
                          this.state.sortedBy === "name" ? (this.state.sortAsc ? "fa-caret-up" : "fa-caret-down") : ""
                        }`}
                      />
                    </th>
                    <th data-id="gender" onClick={this.sortCharacters}>
                      Gender
                      <i
                        className={`fas ${
                          this.state.sortedBy === "gender" ? (this.state.sortAsc ? "fa-caret-up" : "fa-caret-down") : ""
                        }`}
                      />
                    </th>
                    <th data-id="height" onClick={this.sortCharacters}>
                      Height
                      <i
                        className={`fas ${
                          this.state.sortedBy === "height" ? (this.state.sortAsc ? "fa-caret-up" : "fa-caret-down") : ""
                        }`}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.characters.map((character, y) => (
                    <tr key={y}>
                      <td>{character.name}</td>
                      <td>{character.gender}</td>
                      <td>{character.height}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="table total">
                <tbody>
                  <tr>
                    <td>{`TOTAL NUMBER OF CHARACTERS: ${this.state.characters.length}`}</td>
                    <td>{`SUM OF HEIGHTS: ${this.state.sumHeights}`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
