import React from "react";
import PropTypes from "prop-types";
import { _filterByGender, _sortCharacters } from "utility";

class Characters extends React.Component {
  render() {
    return (
      <div className="characters">
        <h5 className="characters-heading">Character List</h5>
        <div className="gender-select-block">
          <select className="gender-select" onChange={e => _filterByGender(e, this)}>
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
              <th data-id="name" onClick={e => _sortCharacters(e, this)}>
                Name
                <i
                  className={`fas ${
                    this.props.sortedBy === "name" ? (this.props.sortAsc ? "fa-caret-up" : "fa-caret-down") : ""
                  }`}
                />
              </th>
              <th data-id="gender" onClick={e => _sortCharacters(e, this)}>
                Gender
                <i
                  className={`fas ${
                    this.props.sortedBy === "gender" ? (this.props.sortAsc ? "fa-caret-up" : "fa-caret-down") : ""
                  }`}
                />
              </th>
              <th data-id="height" onClick={e => _sortCharacters(e, this)}>
                Height
                <i
                  className={`fas ${
                    this.props.sortedBy === "height" ? (this.props.sortAsc ? "fa-caret-up" : "fa-caret-down") : ""
                  }`}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.characters.map((character, y) => (
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
              <td>{`TOTAL NUMBER OF CHARACTERS: ${this.props.characters.length}`}</td>
              <td>{`SUM OF HEIGHTS: ${this.props.sumHeights}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

Characters.propTypes = {
  characters: PropTypes.array,
  sortAsc: PropTypes.bool,
  sortedBy: PropTypes.string,
  sumHeights: PropTypes.string
};

export default Characters;
