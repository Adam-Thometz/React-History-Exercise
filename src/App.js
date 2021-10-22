import React from "react";
import JokeList from "./JokeList";
import JokeListCls from "./JokeListCls";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <JokeListCls />
      </div>
    );
  }
}

export default App;
