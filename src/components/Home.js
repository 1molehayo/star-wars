import React from "react";
import logo from "../assets/img/logo.svg";

class Home extends React.Component {
  render() {
    return (
      <div>
        <section className="intro">
          A long time ago, in a galaxy far,
          <br /> far away....
        </section>

        <section className="logo">
          <img src={logo} alt="logo" />
        </section>

        <section id="board">
          <div id="content">
            <p id="title">Episode I</p>
            <p id="subtitle">THE CODER'S MENACE</p>
            <br />
            <p>
              Turmoil has engulfed the Galactic Republic as Christopher Kade finishes studying to become a master in his
              trade.
            </p>
          </div>
        </section>
      </div>
    );
  }
}

export default Home;
