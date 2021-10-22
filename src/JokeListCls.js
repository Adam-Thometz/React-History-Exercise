import React from "react";
import axios from "axios";
import Joke from "./Joke";
import JokeCls from "./JokeCls";
import "./JokeList.css";
import loading from './loading.gif'

class JokeListCls extends React.Component {
  constructor(props) {
    super(props)
    this.state = {jokes: []}
    this.generateNewJokes = this.generateNewJokes.bind(this)
    this.vote = this.vote.bind(this)
    this.getJokes = this.getJokes.bind(this)
  }

  generateNewJokes() {
    this.setState({jokes: []})
  }

  vote(id, delta) {
    this.setState(state => ({
      jokes: state.jokes.map(j => (j.id === id ? {...j, votes: j.votes + delta} : j))
    }))
  }

  async getJokes(numJokesToGet = 10) {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      while (j.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({jokes: [...j]})
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    this.getJokes()
  }
  
  componentDidUpdate() {
    if (!this.state.jokes.length) this.getJokes()
  }

  render() {
    const {jokes} = this.state
    if (jokes.length) {
      let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes)

      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map(j => (
            <JokeCls text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      )
    }
    return null
  }
}

export default JokeListCls