import axios from "axios";

export const _filterByGender = (event, el) => {
  let characters = [...el.state.characters];
  let tempCharacters = [...el.state.tempCharacters];
  let sumHeights = [...el.state.sumHeights];
  characters = [];
  if (event.target.value === "all") {
    characters = [...tempCharacters];
    sumHeights = _sumHeights(characters);
  } else if (event.target.value === "unknown") {
    characters = tempCharacters.filter(character => character.gender.toLowerCase() === "n/a");
    sumHeights = _sumHeights(characters);
  } else {
    characters = tempCharacters.filter(character => character.gender.toLowerCase() === event.target.value);
    sumHeights = _sumHeights(characters);
  }

  el.setState({ characters, sumHeights });
};

export const _getCharacters = (movie, el) => {
  //   console.log(movie, movie.characters);
  el.setState({ characters: [], tempCharacters: [], sumHeights: 0, isLoadingCharacters: true });
  return movie.characters.forEach(api => {
    axios
      .get(api)
      .then(response => {
        el.setState(prevState => {
          let characters = [...prevState.characters, response.data];
          let tempCharacters = [...prevState.characters, response.data];
          let sumHeights = _sumHeights(characters);
          let isLoadingCharacters = true;
          if (characters.length > 0) {
            isLoadingCharacters = false;
          }
          return { characters, isLoadingCharacters, tempCharacters, sumHeights };
        });
        _sortCharactersByName(false, el);
      })
      .catch(() => {
        _toggleErrorModal("There was an error while loading the movie characters", el);
      });
  });
};

export const _getMovies = el => {
  let movies = [...el.state.movies];
  return axios
    .get("https://swapi.co/api/films/")
    .then(response => {
      movies = _sortMovies(response.data.results);
      el.setState({ isLoadingMovies: false, movies });
    })
    .catch(() => {
      _toggleErrorModal("There was an error while loading the movies", el);
    });
};

export const _isEmpty = obj => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const _refreshPage = () => {
  return window.location.reload();
};

export const _selectMovie = (selectedMovie, el) => {
  el.setState({ selectedMovie: {} }, () =>
    setTimeout(() => {
      _getCharacters(selectedMovie, el);
      el.setState({ selectedMovie });
    }, 0)
  );
};

export const _sortCharacters = (event, el) => {
  const { id } = event.currentTarget.dataset;
  const { sortedBy } = el.state;
  if (sortedBy !== id) {
    el.setState({ sortAsc: true }, () => {
      _sortCheck(id, true, el);
    });
  } else {
    el.setState(
      prevState => ({ sortAsc: !prevState.sortAsc }),
      () => {
        _sortCheck(id, el.state.sortAsc, el);
      }
    );
  }
};

export const _sortCharactersByGender = (reverse, el) => {
  let characters = [...el.state.characters];
  let { sortedBy } = el.state;
  sortedBy = "gender";
  characters.sort((a, b) => {
    const genderA = a.gender.toLowerCase(),
      genderB = b.gender.toLowerCase();
    if (genderA < genderB) return -1;
    if (genderA > genderB) return 1;
    return 0;
  });

  if (reverse) {
    characters.reverse();
  }
  el.setState({ characters, sortedBy });
};

export const _sortCharactersByHeight = (reverse, el) => {
  let characters = [...el.state.characters];
  let { sortedBy } = el.state;
  sortedBy = "height";
  characters.sort((a, b) => {
    return a.height - b.height;
  });
  if (reverse) {
    characters.reverse();
  }

  el.setState({ characters, sortedBy });
};

export const _sortCharactersByName = (reverse, el) => {
  let characters = [...el.state.characters];
  let { sortedBy } = el.state;
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

  el.setState({ characters, sortedBy });
};

export const _sortCheck = (id, sortAsc, el) => {
  if (id === "gender") {
    _sortCharactersByGender(!sortAsc, el);
  }
  if (id === "height") {
    _sortCharactersByHeight(!sortAsc, el);
  }
  if (id === "name") {
    _sortCharactersByName(!sortAsc, el);
  }
};

export const _sortMovies = movies => {
  return movies.sort((a, b) => {
    const dateA = new Date(a.release_date),
      dateB = new Date(b.release_date);
    return dateA - dateB;
  });
};

export const _sumHeights = characters => {
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
};

export const _toggleErrorModal = (error, el) => {
  el.setState(prevState => ({ showError: !prevState.showError, errorMessage: error }));
};
